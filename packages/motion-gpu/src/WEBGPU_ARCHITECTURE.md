# WebGPU Architecture Overview for Beginners

Welcome to the internals of **MotionGPU**! This document provides a high-level architectural overview for developers who are familiar with graphics concepts (like shaders, textures, and uniforms) but are new to the WebGPU API.

MotionGPU is designed to run fullscreen fragment shaders, similar to Shadertoy, but built entirely on top of WebGPU. Let's look at how the code maps to WebGPU concepts.

---

## 1. Core WebGPU Setup

When you create a renderer in MotionGPU (see `src/lib/core/renderer.ts`), you interact with the primary WebGPU interfaces.

### `Adapter` and `Device`
- **Adapter** (`navigator.gpu.requestAdapter`): Represents the physical GPU hardware on your machine. You can request high-performance or low-power adapters.
- **Device** (`adapter.requestDevice`): A logical connection to the Adapter. It is the core object used to create all other WebGPU resources, such as buffers, textures, samplers, and pipelines.

### `CanvasContext`
Just like WebGL, WebGPU requires a context connected to an HTML `<canvas>`. We configure the context with a specific texture `format` (like `bgra8unorm` or `rgba8unorm`). This allows WebGPU to present the rendered result to the screen.

---

## 2. Resources: Buffers, Textures, and Samplers

WebGPU requires explicit creation and memory management for resources.

### `GPUBuffer`
A Buffer holds raw binary data on the GPU. In MotionGPU, we use buffers to store **Uniforms** (variables passed from the CPU to the shader).
- Buffers are created with usage flags. For example, `UNIFORM | COPY_DST` means the buffer can be read by a shader as a uniform, and the CPU can write to it using `device.queue.writeBuffer()`.
- Data must be tightly packed according to WGSL alignment rules. MotionGPU handles this packing automatically in `packUniformsInto()`.

### `GPUTexture` and `GPUTextureView`
- **Texture**: The raw image data on the GPU. Created with specific formats and usages (e.g., `TEXTURE_BINDING` to be read by a shader, `RENDER_ATTACHMENT` to be rendered into).
- **TextureView**: Shaders do not interact with `GPUTexture` directly; they interact with a `GPUTextureView`. A view defines *how* the texture is interpreted (e.g., as a 2D texture, a cubemap, or a specific mip level).

### `GPUSampler`
Samplers define how the GPU reads pixel data from a texture. They control filtering (e.g., nearest-neighbor vs. linear) and wrapping (e.g., clamp-to-edge vs. repeat).

---

## 3. Pipelines and Bind Groups

WebGPU separates the description of resource layouts from the actual bound data.

### `BindGroupLayout` and `PipelineLayout`
- **BindGroupLayout**: Describes the "shape" of the resources a shader expects. For example, "Binding 0 is a Uniform Buffer, Binding 1 is a Sampler, Binding 2 is a Texture".
- **PipelineLayout**: A collection of `BindGroupLayout`s that defines the complete resource signature for a pipeline.

### `GPUBindGroup`
While the layout describes the *types* of resources, a **BindGroup** binds the *actual instances* of those resources (the specific buffers, texture views, and samplers). You create a BindGroup that matches a specific BindGroupLayout.

### `GPURenderPipeline`
The RenderPipeline is an immutable object that bundles together:
- The compiled shader module (`GPUShaderModule`).
- The PipelineLayout.
- Vertex state (entry point function).
- Fragment state (entry point function, output target formats).
- Primitive topology (e.g., `triangle-list`).

Because it's immutable, if you need to change the shader code or the output texture format, you must create a new RenderPipeline!

---

## 4. The Render Loop (Commands and Queues)

WebGPU uses a command-buffer model. You record commands on the CPU and then submit them to the GPU queue for execution.

### `GPUCommandEncoder`
You create a `CommandEncoder` to start recording commands. None of these commands execute immediately.

### `GPURenderPassEncoder`
To actually draw something, you begin a **RenderPass**.
- A RenderPass specifies the `colorAttachments` (the `GPUTextureView`s) where the output will be drawn.
- You specify `loadOp` (e.g., `clear` to wipe the texture, `load` to keep existing contents) and `storeOp` (e.g., `store` to save the rendered result).
- Inside the RenderPass, you set the pipeline (`setPipeline`), set the bind groups (`setBindGroup`), and finally issue the draw call (`draw(3)`).

### `GPUQueue`
Once all commands are recorded, you finish the encoder (`commandEncoder.finish()`) and submit the resulting command buffer to the `device.queue`. The queue handles synchronizing the CPU and GPU.

---

## 5. WGSL Shader Breakdown

MotionGPU uses native WebGPU Shading Language (WGSL). See `src/lib/core/shader.ts` for how the final shader is assembled.

### The Fullscreen Triangle Trick
Since MotionGPU is designed for fullscreen fragment shaders, we don't need complex vertex buffers. Instead, we use a classic graphics trick:
We call `draw(3)` to draw 3 vertices. The vertex shader (`@vertex`) calculates positions using the built-in `vertex_index`. It generates a single massive triangle that completely covers the screen's Normalized Device Coordinates (-1 to 1).
This allows the fragment shader to run for every pixel on the screen.

### WGSL Syntax Highlights
- `@builtin(position)`: Represents the clip-space coordinate (like `gl_Position` in WebGL).
- `@location(0)`: Used to pass data between stages (like varying variables in WebGL). For example, passing `uv` coordinates from the vertex shader to the fragment shader. Also used to specify the output target index for the fragment shader.
- `var<uniform>`: Defines a read-only variable that comes from a uniform buffer.
- `@group(0) @binding(N)`: Connects the WGSL variable to the exact index defined in the CPU's `BindGroupLayout`.
- `textureSample(texture, sampler, uv)`: The WGSL function used to read pixel data from a texture at a specific UV coordinate.

---

## Summary of the MotionGPU Frame

Every frame, MotionGPU does the following:
1. Writes updated `time` and `resolution` to the Frame Uniform Buffer via `queue.writeBuffer`.
2. Packs and writes user-defined uniforms to the User Uniform Buffer.
3. Records commands using a `CommandEncoder`.
4. Begins a `RenderPass` targeting either the Canvas or an offscreen RenderTarget.
5. Sets the `RenderPipeline` and `BindGroup`.
6. Issues a `draw(3)` call to trigger the fullscreen vertex/fragment shaders.
7. Submits the command buffer to the `queue` for execution.
