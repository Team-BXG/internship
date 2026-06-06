import os, re

files = [
    'src/pages/SuperAdmin/AuditLogs.jsx',
    'src/pages/W.approver/Approve Beneficiary.jsx',
    'src/pages/W.encoder/AssignedDemands.jsx',
    'src/pages/W.encoder/ChangeStatus.jsx',
    'src/pages/W.encoder/ProblemHandlings.jsx',
    'src/pages/W.encoder/Register Problem.jsx',
    'src/pages/Z.approver/DemandStatistics.jsx',
    'src/pages/head-expert/DemandStatistics.jsx',
    'src/pages/head-expert/ProblemHandlings.jsx',
    'src/pages/head-expert/Reports.jsx'
]

for file in files:
    if not os.path.exists(file):
        print(f'File not found: {file}')
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove imports
    content = re.sub(r'import\s+.*jspdf.*[\r\n]+', '', content)
    
    # Remove export functions (heuristic: match from const export.*PDF = () => { to the closing brace '  }' or '}' that ends the function)
    # A safer way is to find the index of 'const exportPDF' or 'const exportToPDF' and count braces.
    
    for func_name in ['exportPDF', 'exportToPDF']:
        idx = content.find(f'const {func_name} = () => {{')
        if idx == -1:
            idx = content.find(f'const {func_name} =() => {{')
        if idx != -1:
            # find matching brace
            brace_count = 0
            end_idx = -1
            for i in range(idx, len(content)):
                if content[i] == '{':
                    brace_count += 1
                elif content[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_idx = i
                        break
            if end_idx != -1:
                content = content[:idx] + content[end_idx+1:]
                
    # Remove buttons
    content = re.sub(r'<button[^>]*onClick=\{export(?:To)?PDF\}[^>]*>[\s\S]*?</button>', '', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Processed {file}')

