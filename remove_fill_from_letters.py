import re

# Read the SVG file
with open('public/images/SMGLogo.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match path elements with gold/brown colors (loggans färg)
# These are colors that start with #7, #8, #9 and have brown/gold tones
# We'll remove the fill attribute from these paths to make them transparent
pattern = r'(<path[^>]*)\s+fill="#[789][0-9A-F]{5}"([^>]*>)'

# Replace fill with fill="none" to make them transparent
def replace_fill(match):
    path_start = match.group(1)
    path_end = match.group(2)
    # Check if there's already a fill="none" or if we should add it
    if 'fill=' not in path_start:
        return f'{path_start} fill="none"{path_end}'
    else:
        # Replace existing fill with fill="none"
        path_start = re.sub(r'\s+fill="#[789][0-9A-F]{5}"', ' fill="none"', path_start)
        return f'{path_start}{path_end}'

# Apply the replacement
content = re.sub(pattern, replace_fill, content)

# Write back to file
with open('public/images/SMGLogo.svg', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed fill colors from path elements (made them transparent)")



