import torch
import qai_hub as hub
from qai_hub_models.models.mediapipe_pose import Model

# Load the pre-trained MediaPipe Pose model
model = Model.from_pretrained()
pose_detector_model = model.pose_detector
pose_landmark_detector_model = model.pose_landmark_detector

# Select the on-device execution target (modify based on your available device)
device = hub.Device("Snapdragon X Elite CRD")

# Trace the model for deployment
pose_detector_sample_inputs = pose_detector_model.sample_inputs()
traced_pose_detector_model = torch.jit.trace(
    pose_detector_model,
    [torch.tensor(data[0]) for _, data in pose_detector_sample_inputs.items()]
)

# Compile the traced model for on-device execution
pose_detector_compile_job = hub.submit_compile_job(
    model=traced_pose_detector_model,
    device=device,
    input_specs=pose_detector_model.get_input_spec(),
)

# Get the optimized model that can now run on-device
pose_detector_target_model = pose_detector_compile_job.get_target_model()

# Repeat for pose landmark detector
pose_landmark_detector_sample_inputs = pose_landmark_detector_model.sample_inputs()
traced_pose_landmark_detector_model = torch.jit.trace(
    pose_landmark_detector_model,
    [torch.tensor(data[0]) for _, data in pose_landmark_detector_sample_inputs.items()]
)

pose_landmark_detector_compile_job = hub.submit_compile_job(
    model=traced_pose_landmark_detector_model,
    device=device,
    input_specs=pose_landmark_detector_model.get_input_spec(),
)

pose_landmark_detector_target_model = pose_landmark_detector_compile_job.get_target_model()

print("Model compiled successfully for on-device execution!")
