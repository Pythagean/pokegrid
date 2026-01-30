import json
import sys
from pathlib import Path

def extract_fields(input_file, output_file, fields):
    """
    Extract specified fields from JSON objects and save to output file.
    
    Args:
        input_file: Path to input JSON file
        output_file: Path to output JSON file
        fields: List of field names to extract
    """
    try:
        # Read input JSON
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle both list and single object
        if isinstance(data, list):
            extracted = []
            for item in data:
                if isinstance(item, dict):
                    extracted_item = {field: item.get(field) for field in fields}
                    extracted.append(extracted_item)
        else:
            # Single object
            extracted = {field: data.get(field) for field in fields}
        
        # Write output JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(extracted, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Successfully extracted fields to {output_file}")
        print(f"  Fields extracted: {', '.join(fields)}")
        if isinstance(extracted, list):
            print(f"  Total items processed: {len(extracted)}")
    
    except FileNotFoundError as e:
        print(f"✗ Error: File not found - {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"✗ Error: Invalid JSON - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Usage:
    #   python extract_fields.py <input_file> <output_file> [field1 field2 ...]
    # If no fields are provided, use sensible defaults for the Pokemon dataset.
    if len(sys.argv) < 3:
        print("Usage: python extract_fields.py <input_file> <output_file> <field1> [field2] [field3] ...")
        print("\nExample:")
        print("  python extract_fields.py pokemon_data_full.json extracted.json name id generation types")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    fields = sys.argv[3:]

    # Default fields requested by the user when none are supplied:
    if not fields:
        fields = [
            "id",
            "name",
            "generation",
            "habitat",
            "height",
            "weight",
            "evolution_stage",
            "types",
        ]

    # Run extraction
    extract_fields(input_file, output_file, fields)
