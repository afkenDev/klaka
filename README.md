# Regeln & Verantwortung  
**Vincent:**  
**Tihan:**  
**Kenz:**  

---  

# Workflow für Bearbeitungen  

## 1️⃣ Vor der Arbeit: Neuesten Stand holen  
Falls vorher gepusht wurde, zuerst den aktuellen Stand holen:  

```bash
git checkout dev /main
git pull origin dev /main
git npm i
```
## 2️⃣ Neuen Feature-Branch erstellen
Für jede neue Änderung einen eigenen Branch erstellen:
```bash
git checkout -b feature/beschreibung
```

## 3️⃣ Änderungen umsetzen
🔹 Arbeite am Feature und speichere regelmäßig.

## 4️⃣ Änderungen committen
```bash
git add .
git commit -m "Kurze Beschreibung der Änderung"
```

## 5️⃣ Änderungen pushen
```bash
git push -u origin feature/beschreibung
```
 Der -u-Parameter stellt eine Verknüpfung mit dem Remote-Branch her.
 
## 6️⃣ Merge-Vorbereitung
Falls sich main geändert hat, bevor du mergen willst:
```bash
git checkout dev  /main
git pull origin dev /main
git checkout feature/beschreibung
git merge dev /main  # oder `git rebase main`
```
## 7️⃣ Merge in main (nach Absprache!)
PR auf GitHub erstellen und reviewen lassen.
Falls alles passt: Merge in main.
Danach den Feature-Branch löschen:
```bash
git branch -d feature/beschreibung
git push origin --delete feature/beschreibung
```

## Zusätzliche Hinweise
✅ Immer zuerst git pull origin main, bevor du mit etwas Neuem startest.
✅ Keine direkten Änderungen an main – alles über Feature-Branches!
✅ Falls mehrere Leute am gleichen Feature arbeiten, einen gemeinsamen Branch nutzen.
✅ Vor jedem Merge sicherstellen, dass der Branch aktuell ist.
