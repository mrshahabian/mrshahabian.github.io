---
title: "From Pilot Data to Protocol: Sample-Size Guidance for Multimodal Intent Detection in Assistive Wearable Robotics"
authors: ["Mohamad Reza Shahabian Alashti", "Shadiya Alingal-Meethal", "Patrick Holthaus", "Gabriella Lakatos", "Farshid Amirabdollahian"]
venue: "ICSR+Art 2026"
year: "2026"
url: "https://patrick.holthaus.info/publications/Shahabian2026a.pdf"
abstract: "Designing a sensible data-collection protocol for intent detection in assistive exoskeletons and wearable robots is challenging: too little data yields unstable models, while collecting 'as much data as possible' is costly and often unnecessary. This challenge is particularly relevant in social robotics and human-robot interaction, where HAR from biosignals such as EMG is used to infer user intent and physical state for safer, more adaptive assistance. We propose a generic, model-agnostic procedure that turns a small pilot recording into concrete sample-size guidance using learning curves. Using a 32-channel high-density EMG (HD-EMG) grid on the thigh and a co-located IMU, we record eight repetitions of six lower-limb activities relevant to locomotion assistance and extract 100 ms windows. We compare RF, SVM, LDA, and a ResNet-18 CNN under leave-one-trial-out (LOTO) evaluation, estimating the training fraction needed to reach 90% of each model's peak accuracy and the plateau where adding 10% more data yields less than 1 percentage-point gain. On this pilot dataset, RF/SVM/LDA typically meet both criteria after 20–30% of available windows, whereas the CNN continues to improve up to approximately 70–90%. IMU features outperform HD-EMG alone, and EMG+IMU fusion achieves the highest accuracy. Overall, the protocol provides per-model sample targets and a principled stopping rule to reduce recording and recalibration burden in data-efficient exoskeleton intent detection for human augmentation and wellbeing."
---

Accepted for publication at the 18th International Conference on Social Robotics + Art (ICSR+Art 2026), London, UK. Lecture Notes in Computer Science, Springer, in press.

Preprint: [PDF](https://patrick.holthaus.info/publications/Shahabian2026a.pdf)

This paper proposes a model-agnostic, learning-curve-based procedure for turning a small pilot recording into concrete sample-size targets for multimodal (HD-EMG + IMU) intent detection, giving practitioners a principled stopping rule that reduces recording and recalibration burden when designing data-collection protocols for assistive wearable robotics.
