import requests
import subprocess

URL_BASE = 'http://localhost:3000'

print("=== INSTALADOR DE CÂMERA====\n")

login = input("Login de admin: ").strip()
senha= input("Senha de admin: ").strip()

resposta_login = requests.post(f'{URL_BASE}/login', json={
    "login":login,
    "senha":senha
})

if resposta_login.status_code!=200:
    print("Login falhou. Verifique usuário e senha.")
    exit()

token = resposta_login.json()['token']
headers = {'Authorization': f'Bearer {token}'}
print("Login eftuado com sucesso.\n")

cnpj = input("CNPJ da empresa cliente: ").strip()

resposta_empresa = requests.get(f'{URL_BASE}/api/empresa/cnpj/{cnpj}', headers=headers)

if resposta_empresa.status_code !=200:
    print("Empresa não encontrada com esse CNPJ. Cadastre a empresa antes de continuar.")
    exit()

empresa = resposta_empresa.json()
id_empresa = empresa['id_empresa']
print(f"Empresa encontrada: {empresa['nome']} (id_empresa = {id_empresa})\n")

nome_setor = input("Nome do novo setor (ex: Linha de Produção 2): ").strip()

payload_setor = {
    "nome_setor":nome_setor,
    "id_empresa":id_empresa
}

resposta_setor = requests.post(f'{URL_BASE}/api/criarSetor', json=payload_setor, headers=headers)

if resposta_setor.status_code == 201:
    id_setor = resposta_setor.json()['setor']['id_setor']
    print(f"\nSetor criado com sucesso! id_setor = {id_setor}")

    iniciar_agora = input("\nDeseja iniciar o reconhecimento agora nesta câmera? (s/n): ").strip().lower()

    if iniciar_agora == 's':
        subprocess.run([
            'python', 'reconhecimento.py',
            '--setor', str(id_setor),
            '--empresa', str(id_empresa)
        ])
    else:
        print("\nPara iniciar depois, use este comando:")
        print(f"python reconhecimento.py --setor {id_setor} --empresa {id_empresa}")
else:
    print("Erro ao criar setor:", resposta_setor.json())