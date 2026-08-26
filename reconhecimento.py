from ultralytics import YOLO
import cv2
import requests
import time
import argparse

parser = argparse.ArgumentParser(description=" Controle de EPIs")
parser.add_argument('--fonte', type=int, default=0)
parser.add_argument('--setor', type=int, default=1)
parser.add_argument('--url', type=str, default='http://localhost:3000/api/acesso')
args = parser.parse_args()

INDICE_CAMERA = args.fonte
ID_DO_SETOR = args.setor
URL_DA_API = args.url

print("="*50)
print(f" INICIANDO SENSOR DE EPI (MODO GATILHO MANUAL)")
print(f" Setor Designado: {ID_DO_SETOR}")
print(f" Câmera Física: {INDICE_CAMERA}")
print(f" Servidor Alvo: {URL_DA_API}")
print("="*50)

modelo = YOLO('best.pt')
cap = cv2.VideoCapture(INDICE_CAMERA)

while True:
    comando = input("\n[AGUARDANDO SENSOR] Pressione 's' para ler a câmera ou 'n' para fechar: ").strip().lower()

    if comando == 'n':
        print("Encerrando o sensor...")
        break
    
    elif comando == 's':
        for _ in range(5):
            cap.read()

        ret, frame = cap.read()
        
        if not ret:
            print("Erro: Câmera desconectada ou indisponível.")
            break

        print("Câmera ativada! Analisando imagem...")
        
        detecoes = modelo(frame, verbose=False, conf=0.75)[0]

        itens_na_tela = []
        for box in detecoes.boxes:
            id_classe = int(box.cls[0])
            nome = modelo.names[id_classe]
            itens_na_tela.append(nome.lower())

        pacote_dados = {
            "id_camera": ID_DO_SETOR, 
            "itens_detectados": itens_na_tela
        }

        try:
            resposta = requests.post(URL_DA_API, json=pacote_dados, timeout=2)
            dados_resposta = resposta.json()
            
            print(f"[{time.strftime('%H:%M:%S')}] Localizados: {itens_na_tela} | Status do Acesso: {dados_resposta.get('acesso')}")
            
        except requests.exceptions.RequestException:
            print(f"[{time.strftime('%H:%M:%S')}] Tentando falar com o Servidor Node.js... (Offline)")
            
    else:
        print("Comando inválido. Digite 's' ou 'sair'.")

cap.release()