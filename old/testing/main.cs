using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;
using Vulkan;

namespace FbxModelRenderer
{
    class Program
    {
        static void Main(string[] args)
        {
            // Load the FBX model using Assimp
            // (omitted for brevity)

            // Create the Vulkan instance
            var instance = CreateInstance("BadEngine");

            // Create the Vulkan surface and physical device
            var surface = CreateSurface(instance);
            var physicalDevice = instance.EnumeratePhysicalDevices().First();

            // Create the Vulkan device, command pool, and command buffers
            var device = CreateDevice(physicalDevice);
            var commandPool = CreateCommandPool(device, physicalDevice);
            var commandBuffers = CreateCommandBuffers(device, commandPool);

            // Create the Vulkan swap chain and image views
            var swapChain = CreateSwapChain(device, physicalDevice, surface);
            var imageViews = CreateImageViews(device, swapChain.Images);

            // Create the Vulkan render pass and pipeline
            var renderPass = CreateRenderPass(device, swapChain.ImageFormat);
            var pipelineLayout = CreatePipelineLayout(device);
            var pipeline = CreatePipeline(device, pipelineLayout, renderPass, swapChain.Extent);

            // Create the model object
            var model = new ModelObject(device, commandPool, commandBuffers, scene);

            // Start the main loop
            var cameraPosition = new Vector3(0, 2, -5);
            var cameraTarget = new Vector3(0, 1, 0);
            var cameraSpeed = 0.1f;
            var cameraAngle = 0f;
            var cameraDistance = 5f;
            while (true)
            {
                // Rotate the camera around the model
                cameraAngle += 0.01f;
                cameraPosition = new Vector3((float)Math.Sin(cameraAngle) * cameraDistance, 2f, (float)Math.Cos(cameraAngle) * cameraDistance);
                var viewMatrix = Matrix4x4.CreateLookAt(cameraPosition, cameraTarget, Vector3.UnitY);
                var projectionMatrix = Matrix4x4.CreatePerspectiveFieldOfView(60f * (float)Math.PI / 180f, (float)swapChain.Extent.Width / swapChain.Extent.Height, 0.1f, 100f);

                // Begin the Vulkan command buffer
                var semaphoreInfo = new SemaphoreCreateInfo();
                var imageIndex = swapChain.AcquireNextImage(uint.MaxValue, null);
                var commandBuffer = commandBuffers[imageIndex];
                commandBuffer.Begin(new CommandBufferBeginInfo());

                // Begin the Vulkan render pass
                var renderPassBeginInfo = new RenderPassBeginInfo()
                {
                    RenderPass = renderPass,
                    Framebuffer = swapChain.Framebuffers[imageIndex],
                    RenderArea = new Rect2D() { Offset = new Offset2D(0, 0), Extent = swapChain.Extent },
                    ClearValues = new ClearValue[] { new ClearColorValue(new Vector4(0.392f, 0.584f, 0.929f, 1.0f)), new ClearDepthStencilValue(1.0f, 0) }
                };
                commandBuffer.BeginRenderPass(renderPassBeginInfo, SubpassContents.Inline);

                // Bind the Vulkan pipeline
                commandBuffer.BindPipeline(PipelineBindPoint.Graphics, pipeline);

                // Draw the model
                model.Draw(commandBuffer, viewMatrix, projectionMatrix);

                // End
            // End the Vulkan render pass and command buffer
            commandBuffer.EndRenderPass();
            commandBuffer.End();

            // Submit the Vulkan command buffer
            var submitInfo = new SubmitInfo()
            {
                WaitSemaphores = new Semaphore[] { },
                WaitDstStageMask = new PipelineStageFlags[] { },
                CommandBuffers = new CommandBuffer[] { commandBuffer },
                SignalSemaphores = new Semaphore[] { }
            };
            device.QueueSubmit(device.GetGraphicsQueue(), new SubmitInfo[] { submitInfo }, null);
            device.QueuePresentKHR(new PresentInfoKHR() { WaitSemaphores = new Semaphore[] { }, Swapchains = new SwapchainKHR[] { swapChain }, ImageIndices = new uint[] { imageIndex } });
            device.QueueWaitIdle();
        }
    }

    class ModelObject
    {
        private readonly Vulkan.Buffer vertexBuffer;
        private readonly Vulkan.Buffer indexBuffer;
        private readonly List<DeviceMemory> deviceMemories = new List<DeviceMemory>();
        private readonly PipelineVertexInputStateCreateInfo vertexInputState;
        private readonly PipelineVertexInputStateCreateInfo[] instancedVertexInputState;
        private readonly DescriptorSetLayout descriptorSetLayout;
        private readonly DescriptorPool descriptorPool;
        private readonly DescriptorSet[] descriptorSets;
        private readonly PipelineLayout pipelineLayout;
        private readonly Pipeline pipeline;

        public ModelObject(Device device, CommandPool commandPool, CommandBuffer[] commandBuffers, Assimp.Scene scene)
        {
            // Create the Vulkan vertex buffer and index buffer
            vertexBuffer = CreateVertexBuffer(device, commandPool, commandBuffers[0], scene.Meshes.SelectMany(m => m.Vertices).ToArray());
            indexBuffer = CreateIndexBuffer(device, commandPool, commandBuffers[1], scene.Meshes.SelectMany(m => m.Indices).ToArray());

            // Create the Vulkan descriptor set layout, descriptor pool, and descriptor sets
            descriptorSetLayout = CreateDescriptorSetLayout(device);
            descriptorPool = CreateDescriptorPool(device);
            descriptorSets = CreateDescriptorSets(device, descriptorSetLayout, descriptorPool);

            // Create the Vulkan pipeline layout and pipeline
            pipelineLayout = CreatePipelineLayout(device, descriptorSetLayout);
            pipeline = CreatePipeline(device, pipelineLayout, scene.Meshes.Select(m => m.MaterialIndex).Distinct().ToArray());
        }

        public void Draw(CommandBuffer commandBuffer, Matrix4x4 viewMatrix, Matrix4x4 projectionMatrix)
        {
            // Bind the Vulkan vertex buffer and index buffer
            var vertexBufferInfo = new VertexBufferBindingInfo[]
            {
                new VertexBufferBindingInfo() { Buffer = vertexBuffer, Offset = 0, Stride = 12 }
            };
            var indexBufferInfo = new IndexBufferBindingInfo() { Buffer = indexBuffer, Offset = 0, Type = IndexType.Uint32 };
            commandBuffer.BindVertexBuffers(0, vertexBufferInfo);
            commandBuffer.BindIndexBuffer(indexBufferInfo);

            // Set the Vulkan descriptor set
            commandBuffer.BindDescriptorSets(PipelineBindPoint.Graphics, pipelineLayout, 0, descriptorSets, null);

            // Set the Vulkan push constants
            var pushConstants = new PushConstantData() { ModelMatrix = Matrix4x4.Identity, ViewMatrix = viewMatrix, ProjectionMatrix = projectionMatrix };
            var pushConstantDataPtr = Marshal.AllocHGlobal(Marshal.SizeOf(pushConstants));
            Marshal.StructureToPtr(pushConstants, pushConstantDataPtr, false);
            commandBuffer.PushConstants(pipelineLayout, ShaderStageFlags.Vertex, 0, (uint)Marshal.SizeOf(pushConstants), pushConstantDataPtr);
            Marshal.FreeHGlobal(pushConstantDataPtr);

            // Draw the Vulkan mesh
            commandBuffer.DrawIndexed((uint)indexBufferInfo.Buffer.Size / 4
            foreach (var mesh in scene.Meshes)
            {
                // Bind the Vulkan pipeline and descriptor set for the material
                var materialIndex = mesh.MaterialIndex;
                commandBuffer.BindPipeline(PipelineBindPoint.Graphics, pipeline[materialIndex]);
                commandBuffer.BindDescriptorSets(PipelineBindPoint.Graphics, pipelineLayout, 1, new DescriptorSet[] { descriptorSets[materialIndex] }, null);

                // Draw the Vulkan mesh
                commandBuffer.DrawIndexed((uint)mesh.Indices.Count, 1, (uint)mesh.IndicesOffset, (int)mesh.VerticesOffset, 0);
            }
        }

        private static Vulkan.Buffer CreateVertexBuffer(Device device, CommandPool commandPool, CommandBuffer commandBuffer, Vector3[] vertices)
        {
            // Create the Vulkan vertex buffer
            var bufferSize = (ulong)(vertices.Length * Marshal.SizeOf(typeof(Vector3)));
            var stagingBuffer = CreateBuffer(device, bufferSize, BufferUsageFlags.TransferSrc, MemoryPropertyFlags.HostVisible | MemoryPropertyFlags.HostCoherent, out var stagingBufferMemory);
            var vertexBuffer = CreateBuffer(device, bufferSize, BufferUsageFlags.VertexBuffer | BufferUsageFlags.TransferDst, MemoryPropertyFlags.DeviceLocal, out var vertexBufferMemory);

            // Copy the vertex data to the staging buffer
            var vertexDataPtr = stagingBufferMemory.Map(0, bufferSize);
            Marshal.Copy(vertices, 0, vertexDataPtr, vertices.Length);
            stagingBufferMemory.Unmap();

            // Copy the vertex data from the staging buffer to the vertex buffer
            var copyRegion = new BufferCopy() { Size = bufferSize };
            commandBuffer.Begin(new CommandBufferBeginInfo());
            commandBuffer.CopyBuffer(stagingBuffer, vertexBuffer, new BufferCopy[] { copyRegion });
            commandBuffer.End();

            // Submit the command buffer
            var submitInfo = new SubmitInfo() { CommandBuffers = new CommandBuffer[] { commandBuffer } };
            device.QueueSubmit(device.GetGraphicsQueue(), new SubmitInfo[] { submitInfo }, null);
            device.QueueWaitIdle();

            // Free the staging buffer memory
            device.FreeMemory(stagingBufferMemory);
            device.DestroyBuffer(stagingBuffer);

            return vertexBuffer;
        }

        private static Vulkan.Buffer CreateIndexBuffer(Device device, CommandPool commandPool, CommandBuffer commandBuffer, uint[] indices)
        {
            // Create the Vulkan index buffer
            var bufferSize = (ulong)(indices.Length * sizeof(uint));
            var stagingBuffer = CreateBuffer(device, bufferSize, BufferUsageFlags.TransferSrc, MemoryPropertyFlags.HostVisible | MemoryPropertyFlags.HostCoherent, out var stagingBufferMemory);
            var indexBuffer = CreateBuffer(device, bufferSize, BufferUsageFlags.IndexBuffer | BufferUsageFlags.TransferDst, MemoryPropertyFlags.DeviceLocal, out var indexBufferMemory);

            // Copy the index data to the staging buffer
            var indexDataPtr = stagingBufferMemory.Map(0, bufferSize);
            Marshal.Copy(indices, 0, indexDataPtr, indices.Length);
            stagingBufferMemory.Unmap();

            // Copy the index data from the staging buffer to the index buffer
            var copyRegion = new BufferCopy() { Size = bufferSize };
            commandBuffer.Begin(new CommandBufferBeginInfo());
            commandBuffer.CopyBuffer(stagingBuffer, indexBuffer, new BufferCopy[] { copyRegion });
            commandBuffer.End();

            // Submit the command buffer
            var submitInfo = new SubmitInfo() { CommandBuffers = new CommandBuffer[] { commandBuffer } };
            device.QueueSubmit(device.GetGraphicsQueue(), new SubmitInfo[] { submitInfo }, null);
            device.QueueWaitIdle();

            // Free the staging buffer memory
            device.FreeMemory(stagingBufferMemory);
            device.DestroyBuffer(stagingBuffer);

            return indexBuffer;
        }
        private static DescriptorSetLayout CreateDescriptorSetLayout(Device device)
        {
            // Create the Vulkan descriptor set layout
            var bindings = new DescriptorSetLayoutBinding[]
            {
                new DescriptorSetLayoutBinding()
                {
                    Binding = 0,
                    DescriptorType = DescriptorType.UniformBuffer,
                    StageFlags = ShaderStageFlags.Vertex,
                    DescriptorCount = 1
                },
                new DescriptorSetLayoutBinding()
                {
                    Binding = 1,
                    DescriptorType = DescriptorType.CombinedImageSampler,
                    StageFlags = ShaderStageFlags.Fragment,
                    DescriptorCount = 1
                }
            };
            var layoutCreateInfo = new DescriptorSetLayoutCreateInfo()
            {
                Bindings = bindings
            };
            return device.CreateDescriptorSetLayout(layoutCreateInfo);
        }

        private static DescriptorPool CreateDescriptorPool(Device device)
        {
            // Create the Vulkan descriptor pool
            var poolSizes = new DescriptorPoolSize[]
            {
                new DescriptorPoolSize() { Type = DescriptorType.UniformBuffer, DescriptorCount = 1 },
                new DescriptorPoolSize() { Type = DescriptorType.CombinedImageSampler, DescriptorCount = 1 }
            };
            var poolCreateInfo = new DescriptorPoolCreateInfo()
            {
                MaxSets = 1,
                PoolSizes = poolSizes
            };
            return device.CreateDescriptorPool(poolCreateInfo);
        }

        private static DescriptorSet[] CreateDescriptorSets(Device device, DescriptorSetLayout descriptorSetLayout, DescriptorPool descriptorPool)
        {
            // Create the Vulkan descriptor set
            var allocateInfo = new DescriptorSetAllocateInfo()
            {
                DescriptorPool = descriptorPool,
                SetLayouts = new DescriptorSetLayout[] { descriptorSetLayout }
            };
            var descriptorSets = device.AllocateDescriptorSets(allocateInfo);

            // Update the Vulkan descriptor set
            var descriptorBufferInfo = new DescriptorBufferInfo[] { new DescriptorBufferInfo() { Buffer = device.GetBuffer(), Offset = 0, Range = Marshal.SizeOf(typeof(Matrix4x4)) } };
            var descriptorImageInfo = new DescriptorImageInfo[] { new DescriptorImageInfo() { ImageLayout = ImageLayout.ShaderReadOnlyOptimal, ImageView = device.GetImageView(), Sampler = device.GetSampler() } };
            var descriptorWrites = new WriteDescriptorSet[]
            {
                new WriteDescriptorSet()
                {
                    DstSet = descriptorSets[0],
                    DstBinding = 0,
                    DstArrayElement = 0,
                    DescriptorType = DescriptorType.UniformBuffer,
                    BufferInfo = descriptorBufferInfo
                },
                new WriteDescriptorSet()
                {
                    DstSet = descriptorSets[0],
                    DstBinding = 1,
                    DstArrayElement = 0,
                    DescriptorType = DescriptorType.CombinedImageSampler,
                    ImageInfo = descriptorImageInfo
                }
            };
            device.UpdateDescriptorSets(descriptorWrites, null);

            return descriptorSets;
        }

        private static PipelineLayout CreatePipelineLayout(Device device, DescriptorSetLayout descriptorSetLayout)
        {
            // Create the Vulkan pipeline layout
            var pushConstantRange = new PushConstantRange() { StageFlags = ShaderStageFlags.Vertex, Size = (uint)Marshal.SizeOf(typeof(PushConstantData)), Offset = 0 };
            var layoutCreateInfo = new PipelineLayoutCreateInfo()
            {
                SetLayouts = new DescriptorSetLayout[] { descriptorSetLayout },
                PushConstantRanges = new PushConstantRange[] { pushConstantRange }
            };
            return device.CreatePipelineLayout(layoutCreateInfo);
        }

        private static Pipeline CreatePipeline(Device device, PipelineLayout pipelineLayout, int[] materialIndices)
        {
            // Create the Vulkan shaders
            var vertexShaderModule = CreateShaderModule(device, "shaders/vert.spv");
            var fragmentShaderModule = CreateShaderModule(device, "shaders/frag.spv");

            // Create the Vulkan pipeline
            var pipelineCache = device.CreatePipelineCache(new PipelineCacheCreateInfo());
            var pipelineShaderStageInfos = new PipelineShaderStageCreateInfo[]
            {
                new PipelineShaderStageCreateInfo() { Stage = ShaderStageFlags.Vertex, Module = vertexShaderModule, Name = "main" },
                new PipelineShaderStageCreateInfo() { Stage = ShaderStageFlags.Fragment, Module = fragmentShaderModule, Name = "main" }
            };
            var pipelineVertexInputStateCreateInfo = new PipelineVertexInputStateCreateInfo()
            {
                VertexBindingDescriptions = new VertexInputBindingDescription[] { new VertexInputBindingDescription() { Binding = 0, Stride = 12, InputRate = VertexInputRate.Vertex } },
                VertexAttributeDescriptions = new VertexInputAttributeDescription[] { new VertexInputAttributeDescription() { Binding = 0, Location = 0, Format = Format.R32g32b32Sfloat, Offset = 0 } }
            };
            var pipelineInputAssemblyStateCreateInfo = new PipelineInputAssemblyStateCreateInfo() { Topology = PrimitiveTopology.TriangleList };
            var pipelineViewportStateCreateInfo = new PipelineViewportStateCreateInfo() { Viewports = new Viewport[] { new Viewport() { X = 0, Y = 0, Width = 800, Height = 600, MinDepth = 0, MaxDepth = 1 } }, Scissors = new Rect2D[] { new Rect2D() { Offset = new Offset2D() { X = 0, Y = 0 }, Extent = new Extent2D() { Width = 800, Height = 600 } } } };
            var pipelineRasterizationStateCreateInfo = new PipelineRasterizationStateCreateInfo() { PolygonMode = PolygonMode.Fill, CullMode = CullModeFlags.Back, FrontFace = FrontFace.CounterClockwise, LineWidth = 1 };
            var pipelineMultisampleStateCreateInfo = new PipelineMultisampleStateCreateInfo() { RasterizationSamples = SampleCountFlags.Count1 };
            var pipelineDepthStencilStateCreateInfo = new PipelineDepthStencilStateCreateInfo() { DepthTestEnable = true, DepthWriteEnable = true, DepthCompareOp = CompareOp.Less, DepthBoundsTestEnable = false, StencilTestEnable = false };
            var pipelineColorBlendAttachmentState = new PipelineColorBlendAttachmentState() { ColorWriteMask = ColorComponentFlags.R | ColorComponentFlags.G | ColorComponentFlags.B | ColorComponentFlags.A, BlendEnable = false };
            var pipelineColorBlendStateCreateInfo = new PipelineColorBlendStateCreateInfo() { Attachments = new PipelineColorBlendAttachmentState[] { pipelineColorBlendAttachmentState } };
            var pipelineDynamicStateCreateInfo = new PipelineDynamicStateCreateInfo() { DynamicStates = new DynamicState[] { DynamicState.Viewport, DynamicState.Scissor } };
            var pipelineCreateInfo = new GraphicsPipelineCreateInfo()
            {
                Stages = pipelineShaderStageInfos,
                VertexInputState = pipelineVertexInputStateCreateInfo,
                InputAssemblyState = pipelineInputAssemblyStateCreateInfo,
                ViewportState = pipelineViewportStateCreateInfo,
                RasterizationState = pipelineRasterizationStateCreateInfo,
                MultisampleState = pipelineMultisampleStateCreateInfo,
                DepthStencilState = pipelineDepthStencilStateCreateInfo,
                ColorBlendState = pipelineColorBlendStateCreateInfo,
                DynamicState = pipelineDynamicStateCreateInfo,
                Layout = pipelineLayout,
                RenderPass = device.GetRenderPass(),
                Subpass = 0
            };
            var pipelines = device.CreateGraphicsPipelines(pipelineCache, new GraphicsPipelineCreateInfo[] { pipelineCreateInfo });

            // Destroy the Vulkan shaders
            device.DestroyShaderModule(vertexShaderModule
            );
            device.DestroyShaderModule(fragmentShaderModule);

            return pipelines[0];
        }

        private static ShaderModule CreateShaderModule(Device device, string filename)
        {
            // Load the SPIR-V code from the file
            var codeBytes = File.ReadAllBytes(filename);

            // Create the Vulkan shader module
            var createInfo = new ShaderModuleCreateInfo()
            {
                Code = new ReadOnlySpan<byte>(codeBytes)
            };
            return device.CreateShaderModule(createInfo);
        }

        private static Vulkan.Buffer CreateBuffer(Device device, ulong size, BufferUsageFlags usage, MemoryPropertyFlags memoryProperties, out DeviceMemory memory)
        {
            // Create the Vulkan buffer
            var bufferCreateInfo = new BufferCreateInfo()
            {
                Size = size,
                Usage = usage,
                SharingMode = SharingMode.Exclusive
            };
            var buffer = device.CreateBuffer(bufferCreateInfo);

            // Allocate memory for the Vulkan buffer
            var memoryRequirements = device.GetBufferMemoryRequirements(buffer);
            var memoryTypeIndex = FindMemoryType(device, memoryRequirements.MemoryTypeBits, memoryProperties);
            var memoryAllocateInfo = new MemoryAllocateInfo()
            {
                AllocationSize = memoryRequirements.Size,
                MemoryTypeIndex = memoryTypeIndex
            };
            memory = device.AllocateMemory(memoryAllocateInfo);

            // Bind the memory to the Vulkan buffer
            device.BindBufferMemory(buffer, memory, 0);

            return buffer;
        }

        private static uint FindMemoryType(Device device, uint typeFilter, MemoryPropertyFlags memoryProperties)
        {
            // Find a suitable memory type for the Vulkan buffer
            var memoryPropertiesList = device.GetPhysicalDeviceMemoryProperties().MemoryTypes;
            for (uint i = 0; i < memoryPropertiesList.Length; i++)
            {
                if ((typeFilter & (1 << (int)i)) != 0 && (memoryPropertiesList[i].PropertyFlags & memoryProperties) == memoryProperties)
                {
                    return i;
                }
            }

            throw new Exception("Failed to find a suitable memory type for the Vulkan buffer.");
        }
    }
}

       
