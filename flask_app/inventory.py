# inventory.py

inventory_data = []

def add_to_inventory(image_names, diagnosis):
    """
    Add one entry to the inventory containing multiple image names 
    and a single (combined) diagnosis.
    """
    inventory_data.append({
        "image_names": image_names,   # list of strings (filenames)
        "diagnosis": diagnosis
    })

def get_inventory():
    """
    Return the entire inventory of uploaded images + diagnoses.
    """
    return inventory_data
