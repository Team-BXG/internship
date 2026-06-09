import os
import re

directories = ['frontend/src', 'supplier-portal/src']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Replace template strings: `http://localhost:8000...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}...`
    # Also for 127.0.0.1:8000
    content = re.sub(r'`http://(?:localhost|127\.0\.0\.1):8000(/.*?)`', r'`${import.meta.env.VITE_API_URL || "http://localhost:8000"}\1`', content)
    content = re.sub(r'`http://(?:localhost|127\.0\.0\.1):8000`', r'`${import.meta.env.VITE_API_URL || "http://localhost:8000"}`', content)

    # Replace single/double quoted strings: 'http://localhost:8000...' -> (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '...'
    content = re.sub(r"'http://(?:localhost|127\.0\.0\.1):8000(.*?)'", r"(import.meta.env.VITE_API_URL || 'http://localhost:8000') + '\1'", content)
    content = re.sub(r'"http://(?:localhost|127\.0\.0\.1):8000(.*?)"', r'(import.meta.env.VITE_API_URL || "http://localhost:8000") + "\1"', content)

    # Clean up empty strings concatenations like: + '' or + ""
    content = content.replace(" + ''", "")
    content = content.replace(' + ""', '')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                process_file(os.path.join(root, file))

print("Done.")
