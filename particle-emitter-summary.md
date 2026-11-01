1. Overview & Visual Roles

There are particle emitters configured across the map:

Emitter	Effect in Source Map	Location (Blender)	Location (Godot Y-Up)
rampflowerstream	Continuous river of flower petals and leaves cascading down the Stage 1 start ramp.	(0, -120.32, 135.20)	Vector3(0.0, 135.20, 120.32)
hexflowershooter	Upward fountains bursting petals into the air atop the two hex towers beside the ramp.	Left: (-53.69, -90.42, 128.11)
Right: (53.76, -90.43, 128.11)	Left: Vector3(-53.69, 128.11, 90.42)
Right: Vector3(53.76, 128.11, 90.43)
oarflowersplash	Flower petal splashes upward & back when the rotating oar paddle strikes the water.	Left: (-14.08, -28.80, 112.48)
Right: (14.08, -28.80, 112.48)	Left: Vector3(-14.08, 112.48, 28.80)
Right: Vector3(14.08, 112.48, 28.80)

NOTE

Coordinate Conversion: Source Engine is 
+
𝑍
+Z Up (inches). In Blender (scaled by 
0.01
0.01): 
(
𝑋
,
𝑌
,
𝑍
)
(X,Y,Z). In Godot (
+
𝑌
+Y Up, 
−
𝑍
−Z Forward), the coordinates translate to 
(
𝑋
,
𝑍
,
−
𝑌
)
(X,Z,−Y).

2. Textures Used

The original effect mixes three textures:

pinkflowerparticle.png — Light pink cherry blossom petal
redflowerparticle.png — Vivid red petal
leafparticle.png — Green leaf

In Godot, a single GPUParticles3D node uses one material. You can reproduce the multi-particle mix in one of two ways:

Composite Scene (Easiest): Create a parent Node3D with 3 child GPUParticles3D nodes (one per texture) sharing the same process material.
Texture Atlas / Flipbook (Optimal): Combine the 3 textures into a 
2
×
2
2×2 sprite sheet, enable Particles Anim (
𝐻
=
2
,
𝑉
=
2
H=2,V=2), and randomize anim_offset.
3. Exact Particle Parameters
A. rampflowerstream (The Ramp Petal River)
Goal: Petals stream continuously downward along the surf ramp slope and float in the air.
Amount: 200–400
Lifetime: 3.5–4.5 s (continuous looping)
Emission Shape: Box / Cylinder
emission_box_extents: Vector3(2.5, 0.5, 2.5)
Direction & Velocity:
direction: Vector3(0.0, -0.25, -1.0).normalized() (angled down the slope)
spread: 15.0°
initial_velocity_min: 12.0 m/s
initial_velocity_max: 16.0 m/s
Physics & Gravity:
gravity: Vector3(0, -2.5, 0) (gentle, buoyant float rather than standard -9.8)
linear_accel_min / max: -0.5 to -1.5 (gentle air resistance)
Rotation / Tumbling:
initial_angle_min: 0°, initial_angle_max: 360°
angular_velocity_min: -120.0°/s, angular_velocity_max: 120.0°/s
Scale:
scale_min: 0.7, scale_max: 1.2
Scale Curve: Ramp in from 
0
→
1
0→1 in the first 
10
%
10% of life, fade out in the last 
15
%
15%.
B. hexflowershooter (Hex Pillar Cannons)
Goal: Fountains shooting straight up from the pillar caps, dispersing at the apex and fluttering down.
Amount: 150–250
Lifetime: 3.0–4.0 s
Emission Shape: Ring / Sphere at the top of each pillar
emission_ring_radius: 1.2 m
Direction & Velocity:
direction: Vector3(0.0, 1.0, 0.0) (vertical burst)
spread: 25.0°
initial_velocity_min: 18.0 m/s
initial_velocity_max: 24.0 m/s
Physics & Gravity:
gravity: Vector3(0, -9.8, 0) (climbs high, decelerates at peak, falls back down)
damping_min: 2.0, damping_max: 4.0
Rotation:
angular_velocity_min: -180.0°/s, angular_velocity_max: 180.0°/s
Scale:
scale_min: 0.8, scale_max: 1.3
4. Godot 4 Node Setup

For each GPUParticles3D:

1. Draw Pass (The Mesh)
In the Inspector: Draw Passes 
→
→ Pass 1: New QuadMesh
QuadMesh.size = Vector2(1.0, 1.0)
QuadMesh.material = New StandardMaterial3D
2. StandardMaterial3D Settings
Transparency: Alpha
Cull Mode: Disabled (Two-sided so rotating petals never vanish)
Shading:
Shading Mode: Unshaded (UnlitGeneric in Source engine—keeps petals vibrant without needing direct scene lights)
Albedo:
Texture: pinkflowerparticle.png (or red/leaf)
Billboard:
Billboard Mode: Particle Billboard (or Y-Billboard if you want them to orient with spin)
3. ParticleProcessMaterial Settings
Assign under Process Material: New ParticleProcessMaterial
Configure the Direction, Initial Velocity, Gravity, and Angular Velocity from the specs in Section 3 above.
5. Ready-to-Use GDScript Template

Save this script as RampFlowerStream.gd and attach it to an empty Node3D in Godot to build the entire 3-texture emitter automatically:

gdscript
extends Node3D
@export var pink_texture: Texture2D = preload("res://pinkflowerparticle.png")
@export var red_texture: Texture2D = preload("res://redflowerparticle.png")
@export var leaf_texture: Texture2D = preload("res://leafparticle.png")
func _ready() -> void:
	create_emitter("PinkFlowers", pink_texture, 150)
	create_emitter("RedFlowers", red_texture, 100)
	create_emitter("Leaves", leaf_texture, 80)
func create_emitter(p_name: String, tex: Texture2D, count: int) -> void:
	var particles := GPUParticles3D.new()
	particles.name = p_name
	particles.amount = count
	particles.lifetime = 4.0
	particles.explosiveness = 0.0
	# 1. Process Material (Physics & Velocity)
	var proc_mat := ParticleProcessMaterial.new()
	proc_mat.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_BOX
	proc_mat.emission_box_extents = Vector3(2.5, 0.5, 2.5)
	# Direction down the surf ramp slope
	proc_mat.direction = Vector3(0.0, -0.25, -1.0).normalized()
	proc_mat.spread = 15.0
	proc_mat.initial_velocity_min = 12.0
	proc_mat.initial_velocity_max = 16.0
	# Float gravity & air damping
	proc_mat.gravity = Vector3(0.0, -2.5, 0.0)
	proc_mat.damping_min = 1.0
	proc_mat.damping_max = 2.0
	# 3D Tumbling rotation
	proc_mat.angle_min = 0.0
	proc_mat.angle_max = 360.0
	proc_mat.angular_velocity_min = -120.0
	proc_mat.angular_velocity_max = 120.0
	# Scale
	proc_mat.scale_min = 0.7
	proc_mat.scale_max = 1.1
	particles.process_material = proc_mat
	# 2. Quad Mesh & Billboard Material
	var quad := QuadMesh.new()
	quad.size = Vector2(0.8, 0.8)
	var std_mat := StandardMaterial3D.new()
	std_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	std_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	std_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	std_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	std_mat.albedo_texture = tex
	quad.material = std_mat
	particles.draw_pass_1 = quad
	add_child(particles)