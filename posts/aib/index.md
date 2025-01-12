	# Exam AIB
### Table of Contents
- [[#Algoritmy Generování Klíčů|Algoritmy Generování Klíčů]]
	- [[#Algoritmy Generování Klíčů#Definujte Golombovy pseudonáhodné postuláty|Definujte Golombovy pseudonáhodné postuláty]]
- [[#Samoopravné kódy|Samoopravné kódy]]
	- [[#Samoopravné kódy#Definujte nasledujici pojmy:|Definujte nasledujici pojmy:]]
	- [[#Samoopravné kódy#Definice: samoortogonální kód, samoduální kód, generující a kontrolní matice a vztah mezi nimi (nápověda: vztah souvisí s ortogonalitou)|Definice: samoortogonální kód, samoduální kód, generující a kontrolní matice a vztah mezi nimi (nápověda: vztah souvisí s ortogonalitou)]]
	- [[#Samoopravné kódy#Definujte generující a kontrolní matici. (5 bodů)|Definujte generující a kontrolní matici. (5 bodů)]]
	- [[#Samoopravné kódy#Definujte Reed-Mullerův kód a jeho parametry.|Definujte Reed-Mullerův kód a jeho parametry.]]
	- [[#Samoopravné kódy#Definujte cyklický kód, proč je to hlavní ideál?|Definujte cyklický kód, proč je to hlavní ideál?]]
	- [[#Samoopravné kódy#Definujte Reed-Solomonův kód a jeho generující a kontrolní matice|Definujte Reed-Solomonův kód a jeho generující a kontrolní matice]]
	- [[#Samoopravné kódy#Popište Singletonův odhad. (5 bodů)|Popište Singletonův odhad. (5 bodů)]]
	- [[#Samoopravné kódy#BCH kód pro q < 2, ta těžší definice|BCH kód pro q < 2, ta těžší definice]]
	- [[#Samoopravné kódy#Definujte (m,l,t,epsilon)-fuzzy extraktor.|Definujte (m,l,t,epsilon)-fuzzy extraktor.]]
	- [[#Samoopravné kódy#Definujte konstrukci bezpecneho nacrtu pro Hammingovu vzdalenost|Definujte konstrukci bezpecneho nacrtu pro Hammingovu vzdalenost]]
- [[#Kryptografické protokoly|Kryptografické protokoly]]
	- [[#Kryptografické protokoly#Popište Guillou-Quisquaterův identifikační protokol|Popište Guillou-Quisquaterův identifikační protokol]]
	- [[#Kryptografické protokoly#Popiste Schnorruv identifikacni protokol|Popiste Schnorruv identifikacni protokol]]
	- [[#Kryptografické protokoly#Napiste vetu a dokazte Lagrangeovu interpolaci.|Napiste vetu a dokazte Lagrangeovu interpolaci.]]
	- [[#Kryptografické protokoly#Popište algoritmus Authenticated Key Exchange Protocol 2 (AKEP2) (10 bodů)|Popište algoritmus Authenticated Key Exchange Protocol 2 (AKEP2) (10 bodů)]]
	- [[#Kryptografické protokoly#Kerberos (zjednodušená verze).|Kerberos (zjednodušená verze).]]
	- [[#Kryptografické protokoly#Popište Otway-Reesův protokol. (10 bodů)|Popište Otway-Reesův protokol. (10 bodů)]]
- [[#Detekce Malware|Detekce Malware]]
	- [[#Detekce Malware#Popište alespoň 5 typů dat (příznaků) pro analýzu malwaru.|Popište alespoň 5 typů dat (příznaků) pro analýzu malwaru.]]
	- [[#Detekce Malware#Popište algoritmus branch and bound pro výběr parametrů. (10 bodů)|Popište algoritmus branch and bound pro výběr parametrů. (10 bodů)]]
	- [[#Detekce Malware#Naivní Bayes + odvození vzorce z Bayesovy věty.|Naivní Bayes + odvození vzorce z Bayesovy věty.]]
	- [[#Detekce Malware#Napiste pseudokod algoritmu PAM|Napiste pseudokod algoritmu PAM]]
	- [[#Detekce Malware#Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)|Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)]]
		- [[#Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)#Problém přeučení (Overfitting)|Problém přeučení (Overfitting)]]
		- [[#Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)#Problém nevyvážených dat (Unbalanced Data)|Problém nevyvážených dat (Unbalanced Data)]]
	- [[#Detekce Malware#Popište následující problémy z oblasti detekce malware: minimalizace reakční doby, interpretovatelnost modelů strojového učení a generování adversariálních vzorků. (5 bodů)|Popište následující problémy z oblasti detekce malware: minimalizace reakční doby, interpretovatelnost modelů strojového učení a generování adversariálních vzorků. (5 bodů)]]
- [[#Steganografie|Steganografie]]
	- [[#Steganografie#Steganografie, odvoďte vzoreček pro E\[hα\[2k\]\] (10 bodů) & Definujte LSB vkládání a napište výpočet pravděpodobnosti, že se pixel nezmění v závislosti na relativním užitečném zatížení α.|Steganografie, odvoďte vzoreček pro E\[hα\[2k\]\] (10 bodů) & Definujte LSB vkládání a napište výpočet pravděpodobnosti, že se pixel nezmění v závislosti na relativním užitečném zatížení α.]]
	- [[#Steganografie#Definujte histogramový útok na steganografický záznam. (10 bodů)|Definujte histogramový útok na steganografický záznam. (10 bodů)]]

---
### Algoritmy Generování Klíčů
#### Definujte Golombovy pseudonáhodné postuláty
![](./pic/golombo-028.png)

---
### Samoopravné kódy
#### Definujte nasledujici pojmy:
- Kod C detekuje u chyb + vztah se vzdalenosti kodu
- Kod C opravuje v chyb + vztah se vzdalenosti kodu
![](./pic/kod-047.png)
#### Definice: samoortogonální kód, samoduální kód, generující a kontrolní matice a vztah mezi nimi (nápověda: vztah souvisí s ortogonalitou)
![](./pic/samoorto-050.png)

#### Definujte generující a kontrolní matici. (5 bodů)
![](./pic/gen_con_matrix-052.png)
![](./pic/gen_con_matrix-053.png)
![](./pic/gen_con_matrix-054.png)
#### Definujte Reed-Mullerův kód a jeho parametry.
- Reed-Mullerovy kódy jsou samoopravné kódy, které se používají v bezdrátových komunikačních aplikacích, zejména v komunikaci ve vesmíru.
- Reed-Mullerovy kódy s parametry `r` a `m` značíme `R(r, m)`, kde `r` a `m` jsou celá čísla taková, že `0 ≤ r ≤ m`
- Na Reed-Mullerovy kódy lze nahlížet jako na zobecnění Reed-Solomonových kódů.
- Reed-Mullerovy kódy jsou lineární kódy zadané pomocí vyhodnocení polynomů více proměnných. Zaměříme se hlavně na binární Reed-Mullerovy kódy.
![[reed-muller_codes-058.png]]
![](./pic/reed-muller_codes-059.png)![](./pic/reed-muller_codes-060.png)
![](./pic/reed-muller_codes-061.png)
![](./pic/reed-muller_codes-062.png)
#### Definujte cyklický kód, proč je to hlavní ideál?
![](./pic/cyclic_codes-066.png)
![](./pic/cyclic_codes-067.png)
#### Definujte Reed-Solomonův kód a jeho generující a kontrolní matice
![reed-solomon codes](./pic/reed-solomon_codes-073.png)
![reed-solomon codes](./pic/reed-solomon_codes-074.png)
![reed-solomon codes](./pic/reed-solomon_codes-075.png)
![reed-solomon codes](./pic/reed-solomon_codes-076.png)

#### Popište Singletonův odhad. (5 bodů)
![singleton](./pic/singleton-077.png)
#### BCH kód pro q < 2, ta těžší definice
![](./pic/bch-080.png)
![](./pic/bch-081.png)
![](./pic/bch-082.png)
![](./pic/bch-083.png)
#### Definujte (m,l,t,epsilon)-fuzzy extraktor.
- Fuzzy extraktory se používají pro šifrování a autentifkaci, kde se biometrický vstup využívá jako klíč.

![](./pic/fuzzy-094.png)
![](./pic/fuzzy-095.png)
#### Definujte konstrukci bezpecneho nacrtu pro Hammingovu vzdalenost
![](./pic/nacrt_hamming-098.png)
![](./pic/nacrt_hamming-099.png)

---
### Kryptografické protokoly
#### Popište Guillou-Quisquaterův identifikační protokol
- Zahrnuje 3 zprávy mezi ověřovatelem B a žadatelem A, jehož totožnost má být potvrzena
![](./pic/guillou-130.png)
![](./pic/guillou-131.png)
![](./pic/guillou-132.png)
#### Popiste Schnorruv identifikacni protokol
- Jeho bezpečnost je založena na obtížnosti řešení problému diskrétního logaritmu.
- vhodný pro žadatele s omezenými výpočetními schopnostmi

![](./pic/schnorr-135.png)
![](./pic/schnorr-136.png)
![](./pic/schnorr-137.png)

#### Napiste vetu a dokazte Lagrangeovu interpolaci.
![Lagrangeova interpolace](./pic/lagres_interpolation.png)
#### Popište algoritmus Authenticated Key Exchange Protocol 2 (AKEP2) (10 bodů)
![](./pic/akep-152.png)
![](./pic/akep-153.png)
![](./pic/akep-154.png)
#### Kerberos (zjednodušená verze).
![](./pic/kerberos-162.png)
![](./pic/kerberos-163.png)
![](./pic/kerberos-164.png)
![](./pic/kerberos-165.png)
![](./pic/kerberos-166.png)
![](./pic/kerberos-167.png)
#### Popište Otway-Reesův protokol. (10 bodů)
- Otway-Reesův protokol je "server-based" protokol, který poskytuje autentizovaný přenos klíč· (s ověřováním klíče a zajištěním aktuálnosti klíče) pouze ve 4 zprávách - stejně jako Kerberos, ale zde bez požadavku na časová razítka.
- Neposkytuje však autentizace entity ani potvrzení klíče
![](./pic/otway_rees_protocol-169.png)
![](./pic/otway_rees_protocol-170.png)
![](./pic/otway_rees_protocol-171.png)
![](./pic/otway_rees_protocol-172.png)
![](./pic/otway_rees_protocol-173.png)

---
### Detekce Malware
#### Popište alespoň 5 typů dat (příznaků) pro analýzu malwaru.
![](./pic/data_malware_analysis-211.png)
![](./pic/data_malware_analysis-212.png)
![](./pic/data_malware_analysis-213.png)
![](./pic/data_malware_analysis-214.png)
![](./pic/data_malware_analysis-215.png)
#### Popište algoritmus branch and bound pro výběr parametrů. (10 bodů)
![](./pic/branch_and_bound-232.png)
![](./pic/branch_and_bound-233.png)
#### Naivní Bayes + odvození vzorce z Bayesovy věty.
![](./pic/bayes-243.png)
![](./pic/bayes-244.png)
![](./pic/bayes-245.png)
![](./pic/bayes-246.png)
#### Napiste pseudokod algoritmu PAM
![](./pic/pam-257.png)
#### Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)
![](./pic/overfitting-264.png)
![](./pic/overfitting-265.png)
##### Problém přeučení (Overfitting)
- Model se příliš přizpůsobí trénovacím datům a ztrácí schopnost generalizace.
- Způsobuje nízkou chybu na trénovacích datech, ale vysokou chybu na testovacích datech.
- Příčiny:
    - Příliš složitý model (např. mnoho parametrů).
    - Nedostatek trénovacích dat.
- Řešení:
    - Regularizace (L1, L2).
    - Použití jednoduššího modelu.
    - Zvýšení množství trénovacích dat.
    - Techniky jako cross-validation nebo dropout.
##### Problém nevyvážených dat (Unbalanced Data)
- Třídy v datasetu nejsou rovnoměrně zastoupeny (např. 90 % jedné třídy a 10 % druhé).
- Model může preferovat častější třídu a ignorovat vzácnější.
- Důsledky:
    - Nízká přesnost na méně častých třídách.
    - Bias ve výsledcích modelu.
- Řešení:
    - Vyvážení datasetu (např. undersampling/oversampling).
    - Použití váhových koeficientů při trénování modelu.
    - Specifické metriky hodnocení (např. F1 score, precision-recall).
#### Popište následující problémy z oblasti detekce malware: minimalizace reakční doby, interpretovatelnost modelů strojového učení a generování adversariálních vzorků. (5 bodů)
![](./pic/vyzvy-266.png)
![](./pic/vyzvy-267.png)
![](./pic/vyzvy-268.png)
![](./pic/vyzvy-269.png)
![](./pic/vyzvy-270.png)
![](./pic/vyzvy-271.png)

---
### Steganografie
#### Steganografie, odvoďte vzoreček pro E\[hα\[2k\]\] (10 bodů) & Definujte LSB vkládání a napište výpočet pravděpodobnosti, že se pixel nezmění v závislosti na relativním užitečném zatížení α.
![](./pic/lsb-315.png)
![](./pic/lsb-316.png)
![](./pic/lsb-317.png)
![](./pic/lsb-318.png)
![](./pic/lsb-319.png)
![](./pic/lsb-320.png)
![](./pic/lsb-321.png)
#### Definujte histogramový útok na steganografický záznam. (10 bodů)
![](./pic/histogram-322.png)
![](./pic/histogram-323.png)
![](./pic/histogram-324.png)
![](./pic/histogram-325.png)

---



