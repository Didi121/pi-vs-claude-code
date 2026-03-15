# NVIDIA Nemotron-3-Super

> Modèle de langage open-weights haute performance pour agents IA spécialisés

---

## 🧠 Présentation

**NVIDIA Nemotron™** est une famille de modèles open-source (poids ouverts, données d'entraînement et recettes publiques), conçue pour offrir une efficacité et une précision de pointe dans la construction d'agents IA spécialisés.

**Nemotron-3-Super** est un LLM entraîné par NVIDIA, optimisé pour :
- 🤖 Les **agents collaboratifs** (agentic workflows)
- 💡 Le **raisonnement avancé** (reasoning traces)
- 💬 Les **conversations naturelles** à grande échelle
- 🏭 Les **workloads haute volumétrie** (ex : automatisation de tickets IT)

### Mécanisme de raisonnement

Le modèle génère d'abord une **trace de raisonnement interne**, puis conclut avec une **réponse finale**. Ce comportement est configurable via un flag dans le chat template.

---

## ⚙️ Spécifications techniques

| Paramètre | Valeur |
|-----------|--------|
| **Paramètres actifs** | 12B |
| **Paramètres totaux** | 120B |
| **Architecture** | MoE (Mixture of Experts) |
| **Usage commercial** | ✅ Autorisé |
| **Type de poids** | Open weights |

### Formats disponibles

| Variant | Précision | Usage recommandé |
|---------|-----------|-----------------|
| `Nemotron-3-Super` | BF16 | Qualité maximale |
| `Nemotron-3-Super FP8` | FP8 | Équilibre performance/mémoire |
| `Nemotron-3-Super NVFP4` | NVFP4 | Inférence haute vitesse |

---

## 🌍 Langues supportées

| Langue | Code |
|--------|------|
| Anglais | `en` |
| Français | `fr` |
| Allemand | `de` |
| Italien | `it` |
| Japonais | `ja` |
| Espagnol | `es` |
| Chinois | `zh` |

---

## 📊 Benchmarks

### Connaissances générales

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| MMLU-Pro | **83.73** | 83.63 | 83.33 |

### Raisonnement

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| HMMT Feb25 *(avec outils)* | **94.73** | 94.38 | 95.36 |
| GPQA *(sans outils)* | 79.23 | 79.36 | **79.42** |
| LiveCodeBench v6 *(2024-08 → 2025-05)* | **78.69** | 78.44 | 78.44 |
| LiveCodeBench v5 *(2024-07 → 2024-12)* | **81.19** | 80.99 | 80.56 |
| SciCode *(subtask)* | **42.05** | 41.38 | 40.83 |
| HLE *(sans outils)* | **18.26** | 17.42 | 17.42 |

### Agentic

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| Terminal Bench *(hard subset)* | 25.78 | **26.04** | 24.48 |
| TauBench V2 — Airline | **56.25** | **56.25** | 54.75 |
| TauBench V2 — Retail | 62.83 | **63.05** | 63.38 |
| TauBench V2 — Telecom | **64.36** | 63.93 | 63.27 |
| **TauBench V2 — Moyenne** | **61.15** | 61.07 | 60.46 |

### Chat & Instruction Following

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| IFBench *(prompt)* | 72.58 | 72.32 | **73.30** |
| Scale AI Multi-Challenge | **55.23** | 54.35 | 52.80 |
| Arena-Hard-V2 *(Hard Prompt)* | 73.88 | 76.06 | **76.00** |

### Long Context

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| AA-LCR | **58.31** | 57.69 | 58.06 |
| RULER-500 @ 128k | **96.79** | 96.85 | 95.99 |
| RULER-500 @ 256k | 96.60 | 96.33 | **96.52** |
| RULER-500 @ 512k | **96.09** | 95.66 | 96.23 |

### Multilingue

| Benchmark | BF16 | FP8 | NVFP4 |
|-----------|------|-----|-------|
| MMLU-ProX *(moy. sur toutes les langues)* | **79.35** | 79.21 | 79.37 |

---

## 🏆 Points forts

```
✅ MMLU-Pro     83.73   — Connaissances générales de très haut niveau
✅ HMMT Feb25   94.73   — Raisonnement mathématique exceptionnel (avec outils)
✅ GPQA         79.23   — Sciences avancées sans outils externes
✅ LiveCode     81.19   — Code de production haute qualité
✅ RULER @512k  96.09   — Contexte ultra-long jusqu'à 512k tokens
✅ TauBench     61.15   — Meilleur score moyen en agentic multi-domaine
```

---

## 🚀 Cas d'usage recommandés

- **Automatisation IT** : traitement de tickets, support niveaux 1-2-3
- **Agents collaboratifs** : orchestration multi-agents, pipelines IA
- **Analyse de code** : génération, revue, débogage (LiveCodeBench 81%)
- **Raisonnement scientifique** : GPQA, SciCode
- **Applications multilingues** : 7 langues supportées nativement
- **Documents longs** : contrats, rapports, bases de données (512k ctx)

---

## 📝 Licence

Modèle disponible pour **usage commercial**. Poids ouverts (open weights) avec données d'entraînement et recettes publiées par NVIDIA.

---

*Source : NVIDIA Nemotron™ — [nvidia.com](https://www.nvidia.com)*
