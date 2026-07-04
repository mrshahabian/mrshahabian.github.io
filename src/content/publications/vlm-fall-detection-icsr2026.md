---
title: "Vision–Language Models for Fall Detection in Socially Assistive Robotics: Zero-Shot Prompting and Few-Shot Calibration"
authors: ["Mohamad Reza Shahabian Alashti", "Khashayar Ghamati", "Abolfazl Zaraki", "Baobing Zhang", "Patrick Holthaus", "Shadiya Alingal-Meethal", "Vignesh Velmurugan", "Gabriella Lakatos", "Angela Dickinson", "Farshid Amirabdollahian"]
venue: "ICSR+Art 2026"
year: "2026"
url: "https://patrickholthaus.de/publications/Shahabian2026b.pdf"
videoUrl: "https://youtu.be/WSCsatEl120?si=BLk4EYysYvTKiGG8"
abstract: "Vision–language models (VLMs) offer a promising route to fall detection for socially assistive robots in home and care settings, where timely recognition can trigger assistance or further verification by carers or interactive robots. Most vision-based fall detectors are supervised and require task-specific labelled data and/or robust pose estimation, which can be brittle under occlusion and viewpoint changes and costly to adapt across deployments. This paper investigates whether pretrained VLMs can enable data-free fall detection via zero-shot prompting, and how much a lightweight few-shot calibration step improves performance without requiring backbone tuning. We present (i) a zero-shot detector based on a balanced contrastive prompt bank, and (ii) a few-shot variant that trains only a linear classifier on frozen VLM embeddings. We evaluate these alongside three skeleton-based supervised baselines (2D CNN, 3D CNN, ViT) and a rule-based heuristic on a balanced test set of 40 single-person videos (20 fall, 20 non-fall), with identical windowing (32 frames, 50% overlap) and video-level aggregation (majority vote). The few-shot VLM achieves 100% accuracy, while the zero-shot VLM reaches 92.5% accuracy without fall-specific training data (3 false positives on non-fall videos). Skeleton-based baselines achieve 97.5–100% accuracy but require pose extraction, increasing pipeline complexity. These results suggest that pretrained VLMs can provide a practical perception trigger for robot-in-the-loop verification and escalation in assistive care, with zero-shot prompting achieving high recall at the cost of a small number of false alarms."
---

Accepted for publication at the 18th International Conference on Social Robotics + Art (ICSR+Art 2026), London, UK. Lecture Notes in Computer Science, Springer, in press.

Preprint: [PDF](https://patrickholthaus.de/publications/Shahabian2026b.pdf)

Demo video: [YouTube](https://youtu.be/WSCsatEl120?si=BLk4EYysYvTKiGG8)

Code: [GitHub - FallDetection-public](https://github.com/mrshahabian/FallDetection-public)

This work compares zero-shot and few-shot vision–language model prompting against skeleton-based supervised baselines (2D/3D CNN, Vision Transformer, ST-GCN, TCN+Transformer) and a rule-based heuristic for fall detection, served through a Flask web app for interactive demonstration. The few-shot VLM approach reaches 100% accuracy on a balanced 40-video test set without requiring backbone fine-tuning, making it a practical, data-efficient perception trigger for robot-in-the-loop verification in socially assistive care settings.
