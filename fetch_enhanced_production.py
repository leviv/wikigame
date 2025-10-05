import json
import requests
import time
import sys

def extract_entity_id(wikidata_url):
    """Extract entity ID from Wikidata URL"""
    return wikidata_url.split('/')[-1]

def fetch_entity_data(entity_ids, batch_size=50):
    """Fetch entity data using Wikidata API"""
    
    # Use the wikibase API to get entity data
    url = "https://www.wikidata.org/w/api.php"
    
    params = {
        'action': 'wbgetentities',
        'ids': '|'.join(entity_ids[:batch_size]),
        'format': 'json',
        'props': 'labels|claims',
        'languages': 'en'
    }
    
    headers = {
        'User-Agent': 'WikiGame Data Fetcher 1.0'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def extract_claim_value(claims, property_id, value_type='string'):
    """Extract claim value from Wikidata claims"""
    if property_id not in claims:
        return None
    
    try:
        claim = claims[property_id][0]  # Get first claim
        
        if 'mainsnak' not in claim or 'datavalue' not in claim['mainsnak']:
            return None
            
        if value_type == 'time':
            return claim['mainsnak']['datavalue']['value']['time']
        elif value_type == 'entity':
            return claim['mainsnak']['datavalue']['value']['id']
        elif value_type == 'string':
            return claim['mainsnak']['datavalue']['value']
        elif value_type == 'coordinate':
            coord = claim['mainsnak']['datavalue']['value']
            return f"Point({coord['longitude']} {coord['latitude']})"
    except (KeyError, IndexError):
        return None
    
    return None

def extract_multiple_claim_values(claims, property_id, value_type='entity'):
    """Extract multiple claim values (for occupation, citizenship)"""
    if property_id not in claims:
        return []
    
    values = []
    for claim in claims[property_id]:
        try:
            if 'mainsnak' in claim and 'datavalue' in claim['mainsnak']:
                if value_type == 'entity':
                    values.append(claim['mainsnak']['datavalue']['value']['id'])
                elif value_type == 'string':
                    values.append(claim['mainsnak']['datavalue']['value'])
        except (KeyError, IndexError):
            continue
    
    return values

# Cache for entity labels to avoid repeated API calls
label_cache = {}

def get_entity_label(entity_id, session):
    """Get label for an entity ID with caching"""
    if entity_id in label_cache:
        return label_cache[entity_id]
    
    url = "https://www.wikidata.org/w/api.php"
    params = {
        'action': 'wbgetentities',
        'ids': entity_id,
        'format': 'json',
        'props': 'labels',
        'languages': 'en'
    }
    
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'entities' in data and entity_id in data['entities']:
            labels = data['entities'][entity_id].get('labels', {})
            if 'en' in labels:
                label = labels['en']['value']
                label_cache[entity_id] = label
                return label
    except:
        pass
    
    label_cache[entity_id] = None
    return None

def get_place_with_country(place_id, session):
    """Get place label with country information"""
    if not place_id:
        return ''
    
    cache_key = f"place_{place_id}"
    if cache_key in label_cache:
        return label_cache[cache_key]
    
    url = "https://www.wikidata.org/w/api.php"
    params = {
        'action': 'wbgetentities',
        'ids': place_id,
        'format': 'json',
        'props': 'labels|claims',
        'languages': 'en'
    }
    
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'entities' in data and place_id in data['entities']:
            entity = data['entities'][place_id]
            labels = entity.get('labels', {})
            claims = entity.get('claims', {})
            
            place_name = ''
            if 'en' in labels:
                place_name = labels['en']['value']
            
            # Try to get country information
            country_name = ''
            # Check for country (P17)
            if 'P17' in claims:
                try:
                    country_id = claims['P17'][0]['mainsnak']['datavalue']['value']['id']
                    country_name = get_entity_label(country_id, session) or ''
                except:
                    pass
            
            # If no direct country, try administrative territorial entity (P131) and traverse up
            if not country_name and 'P131' in claims:
                try:
                    admin_id = claims['P131'][0]['mainsnak']['datavalue']['value']['id']
                    # Get the administrative entity and check if it has a country
                    admin_data = get_entity_with_country(admin_id, session)
                    if admin_data and admin_data.get('country'):
                        country_name = admin_data['country']
                except:
                    pass
            
            # Format the result
            if place_name and country_name and place_name != country_name:
                result = f"{place_name}, {country_name}"
            elif place_name:
                result = place_name
            else:
                result = ''
            
            label_cache[cache_key] = result
            return result
    except:
        pass
    
    label_cache[cache_key] = ''
    return ''

def get_full_image_url(filename):
    """Convert Wikimedia Commons filename to full URL"""
    if not filename:
        return ''
    
    # Remove "File:" prefix if present
    if filename.startswith('File:'):
        filename = filename[5:]
    
    # URL encode the filename
    import urllib.parse
    encoded_filename = urllib.parse.quote(filename.replace(' ', '_'))
    
    # Generate the full Commons URL
    return f"https://commons.wikimedia.org/wiki/File:{encoded_filename}"

def get_entity_with_country(entity_id, session):
    """Get entity data including country information"""
    url = "https://www.wikidata.org/w/api.php"
    params = {
        'action': 'wbgetentities',
        'ids': entity_id,
        'format': 'json',
        'props': 'labels|claims',
        'languages': 'en'
    }
    
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'entities' in data and entity_id in data['entities']:
            entity = data['entities'][entity_id]
            claims = entity.get('claims', {})
            
            # Check for country (P17)
            if 'P17' in claims:
                try:
                    country_id = claims['P17'][0]['mainsnak']['datavalue']['value']['id']
                    country_name = get_entity_label(country_id, session)
                    return {'country': country_name}
                except:
                    pass
    except:
        pass
    
    return None
    """Get entity data including country information"""
    url = "https://www.wikidata.org/w/api.php"
    params = {
        'action': 'wbgetentities',
        'ids': entity_id,
        'format': 'json',
        'props': 'labels|claims',
        'languages': 'en'
    }
    
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'entities' in data and entity_id in data['entities']:
            entity = data['entities'][entity_id]
            claims = entity.get('claims', {})
            
            # Check for country (P17)
            if 'P17' in claims:
                try:
                    country_id = claims['P17'][0]['mainsnak']['datavalue']['value']['id']
                    country_name = get_entity_label(country_id, session)
                    return {'country': country_name}
                except:
                    pass
    except:
        pass
    
    return None

def get_wikipedia_article(entity_id, session):
    """Get English Wikipedia article URL"""
    url = "https://www.wikidata.org/w/api.php"
    params = {
        'action': 'wbgetentities',
        'ids': entity_id,
        'format': 'json',
        'props': 'sitelinks',
        'sitefilter': 'enwiki'
    }
    
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'entities' in data and entity_id in data['entities']:
            sitelinks = data['entities'][entity_id].get('sitelinks', {})
            if 'enwiki' in sitelinks:
                title = sitelinks['enwiki']['title']
                return f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
    except:
        pass
    
    return None

def process_entity_data(entity_data, session):
    """Process entity data into structured format"""
    processed = {}
    
    if 'entities' not in entity_data:
        return processed
    
    for entity_id, data in entity_data['entities'].items():
        # Skip if entity not found
        if 'missing' in data:
            continue
            
        claims = data.get('claims', {})
        labels = data.get('labels', {})
        
        person_label = labels.get('en', {}).get('value', '')
        
        # Extract basic info
        person_info = {
            'person': f"http://www.wikidata.org/entity/{entity_id}",
            'personLabel': person_label,
            'birthDate': extract_claim_value(claims, 'P569', 'time'),
            'deathDate': extract_claim_value(claims, 'P570', 'time'),
            'gender': '',
            'photo': get_full_image_url(extract_claim_value(claims, 'P18', 'string')),
            'coords': extract_claim_value(claims, 'P625', 'coordinate'),
            'placeOfBirth': '',
            'placeOfDeath': '',
            'citizenship': '',
            'occupation': '',
            'article': ''
        }
        
        # Get place labels with country information
        place_of_birth_id = extract_claim_value(claims, 'P19', 'entity')
        if place_of_birth_id:
            person_info['placeOfBirth'] = get_place_with_country(place_of_birth_id, session)
            
        place_of_death_id = extract_claim_value(claims, 'P20', 'entity')
        if place_of_death_id:
            person_info['placeOfDeath'] = get_place_with_country(place_of_death_id, session)
        
        # Get gender label
        gender_id = extract_claim_value(claims, 'P21', 'entity')
        if gender_id:
            person_info['gender'] = get_entity_label(gender_id, session) or ''
        
        # Get citizenship (can be multiple)
        citizenship_ids = extract_multiple_claim_values(claims, 'P27', 'entity')
        citizenship_labels = []
        for cid in citizenship_ids[:3]:  # Limit to 3 to avoid too many API calls
            label = get_entity_label(cid, session)
            if label:
                citizenship_labels.append(label)
        person_info['citizenship'] = '|'.join(citizenship_labels)
        
        # Get occupation (can be multiple)
        occupation_ids = extract_multiple_claim_values(claims, 'P106', 'entity')
        occupation_labels = []
        for oid in occupation_ids[:3]:  # Limit to 3
            label = get_entity_label(oid, session)
            if label:
                occupation_labels.append(label)
        person_info['occupation'] = '|'.join(occupation_labels)
        
        # Get Wikipedia article
        person_info['article'] = get_wikipedia_article(entity_id, session) or ''
        
        processed[entity_id] = person_info
    
    return processed

def is_relevant_person(person_data):
    """Check if a person has enough relevant information"""
    required_fields = ['personLabel', 'birthDate', 'deathDate', 'photo']
    
    # Must have all required fields (including photo)
    for field in required_fields:
        value = person_data.get(field, '')
        if not value or value == '':
            return False
    
    # Count non-empty optional fields
    optional_fields = ['placeOfBirth', 'placeOfDeath', 'citizenship', 'occupation', 'gender', 'article']
    filled_optional = sum(1 for field in optional_fields if person_data.get(field, ''))
    
    return filled_optional >= 2  # Must have at least 2 optional fields filled (reduced from 3 since photo is now required)

def main():
    # Get limit from command line argument
    limit = None
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except ValueError:
            print("Usage: python script.py [limit]")
            sys.exit(1)
    
    print("Loading filtered causes of death data...")
    
    with open('humans_filtered_cleaned.json', 'r') as f:
        filtered_data = json.load(f)
    
    if limit:
        filtered_data = filtered_data[:limit]
        print(f"Processing {len(filtered_data)} people (limited)")
    else:
        print(f"Processing {len(filtered_data)} people (full dataset)")
    
    # Extract entity IDs and create cause of death mapping
    entity_ids = []
    cause_of_death_map = {}
    
    for item in filtered_data:
        entity_id = extract_entity_id(item['person'])
        entity_ids.append(entity_id)
        cause_of_death_map[entity_id] = {
            'causeOfDeath': item['causeOfDeath'],
            'causeOfDeathLabel': item['causeOfDeathLabel']
        }
    
    print("Fetching Wikidata information...")
    
    session = requests.Session()
    session.headers.update({'User-Agent': 'WikiGame Data Fetcher 1.0'})
    
    all_processed = {}
    batch_size = 25  # Smaller batches for stability
    total_batches = (len(entity_ids) + batch_size - 1) // batch_size
    
    for i in range(0, len(entity_ids), batch_size):
        batch = entity_ids[i:i + batch_size]
        batch_num = i // batch_size + 1
        
        print(f"Processing batch {batch_num}/{total_batches} ({len(batch)} people)")
        
        entity_data = fetch_entity_data(batch, batch_size)
        if entity_data:
            processed = process_entity_data(entity_data, session)
            all_processed.update(processed)
            print(f"  -> Got data for {len(processed)} people")
        else:
            print(f"  -> Failed to get data for batch {batch_num}")
        
        # Save progress every 100 batches
        if batch_num % 100 == 0:
            relevant_people = []
            for entity_id, person_data in all_processed.items():
                if is_relevant_person(person_data):
                    if entity_id in cause_of_death_map:
                        person_data.update(cause_of_death_map[entity_id])
                        relevant_people.append(person_data)
            
            with open(f'humans_enhanced_progress_{batch_num}.json', 'w') as f:
                json.dump(relevant_people, f, indent=2, ensure_ascii=False)
            print(f"  -> Saved progress: {len(relevant_people)} relevant people so far")
        
        time.sleep(0.5)  # Be respectful to the API
    
    print("Filtering for relevant people...")
    
    relevant_people = []
    for entity_id, person_data in all_processed.items():
        if is_relevant_person(person_data):
            # Add cause of death info
            if entity_id in cause_of_death_map:
                person_data.update(cause_of_death_map[entity_id])
                relevant_people.append(person_data)
    
    success_rate = (len(relevant_people) / len(all_processed)) * 100 if all_processed else 0
    print(f"Found {len(relevant_people)} relevant people with sufficient data ({success_rate:.1f}% success rate)")
    
    # Save final results
    output_file = 'humans_enhanced_relevant.json'
    if limit:
        output_file = f'humans_enhanced_relevant_{limit}.json'
        
    with open(output_file, 'w') as f:
        json.dump(relevant_people, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Enhanced dataset saved to {output_file}")
    
    # Show statistics
    stats = {
        'total_processed': len(entity_ids),
        'data_fetched': len(all_processed),
        'relevant_people': len(relevant_people),
        'with_photo': sum(1 for p in relevant_people if p.get('photo', '')),
        'with_coords': sum(1 for p in relevant_people if p.get('coords', '')),
        'with_article': sum(1 for p in relevant_people if p.get('article', '')),
        'with_citizenship': sum(1 for p in relevant_people if p.get('citizenship', '')),
        'with_occupation': sum(1 for p in relevant_people if p.get('occupation', '')),
    }
    
    print("\\nFinal Statistics:")
    for key, value in stats.items():
        print(f"- {key.replace('_', ' ').title()}: {value}")

if __name__ == "__main__":
    main()