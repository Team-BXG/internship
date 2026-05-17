import os
import re

files = [
    "src/pages/Z.expert/AgentRegistration.jsx",
    "src/pages/W.encoder/Register Problem.jsx",
    "src/pages/W.encoder/Register Demand.jsx",
    "src/pages/W.encoder/Register Beneficiary.jsx",
    "src/pages/W.encoder/ChangeStatus.jsx",
    "src/pages/W.approver/Review Demands.jsx",
    "src/pages/super-admin/Supplier management/RegisterSupplier.jsx",
    "src/pages/super-admin/DemandStatistics.jsx",
    "src/pages/super-admin/DemandStatisticsSimple.jsx",
    "src/pages/super-admin/Contractor registration/RegisterContractor.jsx"
]

for fpath in files:
    if not os.path.exists(fpath): continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    if "alert(" not in content: continue

    # Add import if missing
    if "react-hot-toast" not in content:
        content = re.sub(r"(import React.*?;\n)", r"\1import toast from 'react-hot-toast';\n", content, count=1)
        if "import toast" not in content:
            content = "import toast from 'react-hot-toast';\n" + content

    # Replace alert("...success...") with toast.success
    content = re.sub(r'alert\((["\'].*?success.*?["\'])\)', r'toast.success(\1)', content, flags=re.IGNORECASE)
    # Replace alert("...error...") or alert("...fail...") with toast.error
    content = re.sub(r'alert\((["\'].*?(error|fail).*?["\'])\)', r'toast.error(\1)', content, flags=re.IGNORECASE)
    # Replace remaining alert(...) with toast.error(...) as a catch-all since most are errors, 
    # except we'll just use toast() to be safe, but they want red/green, so toast.error is fine 
    # if it's an error. We'll use toast.success if we missed something. 
    # Wait, simple toast.error is fine for the rest as they are usually submission errors.
    content = re.sub(r'alert\(', r'toast.error(', content)
    
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
print("done")
