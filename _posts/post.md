---
layout: post
title: "Markdown and Code Snippets"
date: 2025-01-21
---

# Exam AIB
### Table of Contents

- [Algoritmy Generování Klíčů](#algoritmy-generov%C3%A1n%C3%AD-kl%C3%AD%C4%8D%C5%AF)
	- [Definujte Golombovy pseudonáhodné postuláty](#definujte-golombovy-pseudon%C3%A1hodn%C3%A9-postul%C3%A1ty)
- [Samoopravné kódy](#samoopravn%C3%A9-k%C3%B3dy)
	- [Definujte nasledujici pojmy:](#definujte-nasledujici-pojmy)
	- [Definice: samoortogonální kód, samoduální kód, generující a kontrolní matice a vztah mezi nimi (nápověda: vztah souvisí s ortogonalitou)](#definice-samoortogon%C3%A1ln%C3%AD-k%C3%B3d-samodu%C3%A1ln%C3%AD-k%C3%B3d-generuj%C3%ADc%C3%AD-a-kontroln%C3%AD-matice-a-vztah-mezi-nimi-n%C3%A1pov%C4%9Bda-vztah-souvis%C3%AD-s-ortogonalitou)
	- [Definujte generující a kontrolní matici. (5 bodů)](#definujte-generuj%C3%ADc%C3%AD-a-kontroln%C3%AD-matici-5-bod%C5%AF)
	- [Definujte Reed-Mullerův kód a jeho parametry.](#definujte-reed-muller%C5%AFv-k%C3%B3d-a-jeho-parametry)
	- [Definujte cyklický kód, proč je to hlavní ideál?](#definujte-cyklick%C3%BD-k%C3%B3d-pro%C4%8D-je-to-hlavn%C3%AD-ide%C3%A1l)
	- [Definujte Reed-Solomonův kód a jeho generující a kontrolní matice](#definujte-reed-solomon%C5%AFv-k%C3%B3d-a-jeho-generuj%C3%ADc%C3%AD-a-kontroln%C3%AD-matice)
	- [Popište Singletonův odhad. (5 bodů)](#popi%C5%A1te-singleton%C5%AFv-odhad-5-bod%C5%AF)
	- [BCH kód pro q < 2, ta těžší definice](#bch-k%C3%B3d-pro-q--2-ta-t%C4%9B%C5%BE%C5%A1%C3%AD-definice)
	- [Definujte (m,l,t,epsilon)-fuzzy extraktor.](#definujte-mltepsilon-fuzzy-extraktor)
	- [Definujte konstrukci bezpecneho nacrtu pro Hammingovu vzdalenost](#definujte-konstrukci-bezpecneho-nacrtu-pro-hammingovu-vzdalenost)
- [Kryptografické protokoly](#kryptografick%C3%A9-protokoly)
	- [Popište Guillou-Quisquaterův identifikační protokol](#popi%C5%A1te-guillou-quisquater%C5%AFv-identifika%C4%8Dn%C3%AD-protokol)
	- [Popiste Schnorruv identifikacni protokol](#popiste-schnorruv-identifikacni-protokol)
	- [Napiste vetu a dokazte Lagrangeovu interpolaci.](#napiste-vetu-a-dokazte-lagrangeovu-interpolaci)
	- [Popište algoritmus Authenticated Key Exchange Protocol 2 (AKEP2) (10 bodů)](#popi%C5%A1te-algoritmus-authenticated-key-exchange-protocol-2-akep2-10-bod%C5%AF)
	- [Kerberos (zjednodušená verze).](#kerberos-zjednodu%C5%A1en%C3%A1-verze)
	- [Popište Otway-Reesův protokol. (10 bodů)](#popi%C5%A1te-otway-rees%C5%AFv-protokol-10-bod%C5%AF)
- [Detekce Malware](#detekce-malware)
	- [Popište alespoň 5 typů dat (příznaků) pro analýzu malwaru.](#popi%C5%A1te-alespo%C5%88-5-typ%C5%AF-dat-p%C5%99%C3%ADznak%C5%AF-pro-anal%C3%BDzu-malwaru)
	- [Popište algoritmus branch and bound pro výběr parametrů. (10 bodů)](#popi%C5%A1te-algoritmus-branch-and-bound-pro-v%C3%BDb%C4%9Br-parametr%C5%AF-10-bod%C5%AF)
	- [Naivní Bayes + odvození vzorce z Bayesovy věty.](#naivn%C3%AD-bayes--odvozen%C3%AD-vzorce-z-bayesovy-v%C4%9Bty)
	- [Napiste pseudokod algoritmu PAM](#napiste-pseudokod-algoritmu-pam)
	- [Vysvětlete problém přeučení a problém nevyvážených dat. (5 bodů)](#vysv%C4%9Btlete-probl%C3%A9m-p%C5%99eu%C4%8Den%C3%AD-a-probl%C3%A9m-nevyv%C3%A1%C5%BEen%C3%BDch-dat-5-bod%C5%AF)
		- [Problém přeučení (Overfitting)](#probl%C3%A9m-p%C5%99eu%C4%8Den%C3%AD-overfitting)
		- [Problém nevyvážených dat (Unbalanced Data)](#probl%C3%A9m-nevyv%C3%A1%C5%BEen%C3%BDch-dat-unbalanced-data)
	- [Popište následující problémy z oblasti detekce malware: minimalizace reakční doby, interpretovatelnost modelů strojového učení a generování adversariálních vzorků. (5 bodů)](#popi%C5%A1te-n%C3%A1sleduj%C3%ADc%C3%AD-probl%C3%A9my-z-oblasti-detekce-malware-minimalizace-reak%C4%8Dn%C3%AD-doby-interpretovatelnost-model%C5%AF-strojov%C3%A9ho-u%C4%8Den%C3%AD-a-generov%C3%A1n%C3%AD-adversari%C3%A1ln%C3%ADch-vzork%C5%AF-5-bod%C5%AF)
- [Steganografie](#steganografie)
	- [Steganografie, odvoďte vzoreček pro E\[hα\[2k\]\] (10 bodů) & Definujte LSB vkládání a napište výpočet pravděpodobnosti, že se pixel nezmění v závislosti na relativním užitečném zatížení α.](#steganografie-odvo%C4%8Fte-vzore%C4%8Dek-pro-e%5Ch%CE%B1%5C2k%5C%5C-10-bod%C5%AF--definujte-lsb-vkl%C3%A1d%C3%A1n%C3%AD-a-napi%C5%A1te-v%C3%BDpo%C4%8Det-pravd%C4%9Bpodobnosti-%C5%BEe-se-pixel-nezm%C4%9Bn%C3%AD-v-z%C3%A1vislosti-na-relativn%C3%ADm-u%C5%BEite%C4%8Dn%C3%A9m-zat%C3%AD%C5%BEen%C3%AD-%CE%B1)
	- [Definujte histogramový útok na steganografický záznam. (10 bodů)](#definujte-histogramov%C3%BD-%C3%BAtok-na-steganografick%C3%BD-z%C3%A1znam-10-bod%C5%AF)

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




