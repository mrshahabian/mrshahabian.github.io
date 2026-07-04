---
title: "Pexformer: Robust Indoor Human Localisation via Patch-level Tokenisation and Semi-Permeable Attention"
authors: ["Baobing Zhang", "Sehrish Rafique", "Mohamad Reza Shahabian Alashti", "Shadiya Alingal-Meethal", "Vignesh Velmurugan", "Patrick Holthaus", "Gabriella Lakatos", "Angela Dickinson", "Farshid Amirabdollahian"]
venue: "ICSR+Art 2026"
year: "2026"
url: "https://patrick.holthaus.info/publications/Zhang2026.pdf"
abstract: "Social robots are increasingly explored within Ambient Assisted Living (AAL) settings, to support people living alone in ways that preserve autonomy and dignity. To facilitate effective interactions and prompt assistance, such as proactive check-ins, safe navigation, or escalation when something appears wrong, knowing the person's location in the home is invaluable. Non-intrusive and exteroceptive sensors are often used to estimate a person's location in a house. However, existing data-driven methods often struggle with extreme class imbalance characterised by long-tail distributions of room occupancy and the inherent noise of sparse sensor triggers emerging from AAL settings. To address these challenges, this paper introduces Patch-Excel-Transformer (Pexformer), a novel architecture that adapts efficient computational paradigms from the tabular domain to time-series localisation tasks, to maintain accuracy with such sparse data. Pexformer leverages patch-level tokenisation to effectively capture local temporal dynamics and integrates a Semi-Permeable Attention (SPA) mechanism to construct hierarchical feature interactions, reducing computational complexity while preserving critical information. Notably, we further observe that a simple random permutation of tokens acts as an effective regulariser and performs comparably to or better than mutual information (MI)-based ordering, avoiding the need for costly statistical pre-computation. Experiments on real-world smart home datasets confirm that Pexformer achieves state-of-the-art localisation accuracy and strong balanced performance, particularly for under-represented room categories, without relying on complex oversampling techniques."
---

Accepted for publication at the 18th International Conference on Social Robotics + Art (ICSR+Art 2026), London, UK. Lecture Notes in Computer Science, Springer, in press.

Preprint: [PDF](https://patrick.holthaus.info/publications/Zhang2026.pdf)

Code: [GitHub - pexformer](https://github.com/baobingzhang/pexformer)

Pexformer adapts tabular-domain computational paradigms to time-series indoor localisation, combining patch-level tokenisation with a Semi-Permeable Attention mechanism to handle the extreme class imbalance and sparse sensor triggers typical of Ambient Assisted Living settings. On real-world smart home datasets it substantially outperforms BiLSTM, NODE, TabTransformer, and DCN V2 baselines (93.3% accuracy, 83.52% Macro-F1), with a simple random-permutation regularisation strategy proving as effective as costlier mutual-information-based token ordering.
