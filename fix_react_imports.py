import os

def fix_react_imports(directory):
    for root, dirs, files in os.walk(directory):
        if ".next" in root or "node_modules" in root:
            continue
        for file in files:
            if file.endswith((".tsx", ".jsx")):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        lines = f.readlines()

                    content = "".join(lines)
                    has_react = "import React" in content or "import * as React" in content or "from 'react'" in content

                    if not has_react:
                        # Find if there's a "use client" directive
                        directive_index = -1
                        for i, line in enumerate(lines):
                            if '"use client"' in line or "'use client'" in line:
                                directive_index = i
                                break

                        if directive_index != -1:
                            lines.insert(directive_index + 1, "import React from 'react';\n")
                        else:
                            lines.insert(0, "import React from 'react';\n")

                        with open(filepath, 'w') as f:
                            f.writelines(lines)
                        print(f"Added React import to: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    fix_react_imports("app")
    fix_react_imports("components")
