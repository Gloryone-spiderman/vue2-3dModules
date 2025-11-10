<template>
    <div ref="container" class="three-container"></div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three/examples/jsm/controls/OrbitControls'

export default {
    name: 'ThreeScene', 
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            cube: null,
            model: null
        }
    },
    mounted() {
        // 初始化场景
        this.initThree()
    },
    beforeDestroy() {
        // 销毁场景
        this.cleanup()
    },
    methods: {
        initThree() {
            // 初始化Three.js场景
            this.scene = new THREE.Scene()
            this.scene.background = new THREE.Color(0xf0f0f0)

            // 初始化相机
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            this.camera.position.z = 5

            // 初始化渲染器
            this.renderer = new THREE.WebGLRenderer({ antialias: true })
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.$refs.container.appendChild(this.renderer.domElement)

            // 初始化轨道控制器
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enableDamping = true
            this.controls.dampingFactor = 0.25

            // 添加基础几何体
            this.cube = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshBasicMaterial({ 
                    color: 0x00ff00,  
                    metalness: 0.3,
                    roughness: 0.4
                })
            )
            this.scene.add(this.cube)
            
            // 渲染场景
            this.render()
            
            // 添加光源
            const light = new THREE.DirectionalLight(0x404040, 0.6)
            light.position.set(1, 1, 1)
            this.scene.add(light)

            // 添加方向光源
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            directionalLight.position.set(-1, -1, -1)
            this.scene.add(directionalLight)

            // 开始动态渲染场景
            this.animate()

            // 添加窗口大小变化监听
            window.addEventListener('resize', this.onWindowResize)
        },
        
        // 渲染场景
        render() {
            this.renderer.render(this.scene, this.camera)
        },
        
        // 动态渲染场景
        animate() {
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.render()
        },
        
        // 窗口大小变化时调整相机和渲染器
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.render()
        },
        
        // 销毁场景
        cleanup() {
            if (this.renderer) {
                this.renderer.dispose()
            }
            window.removeEventListener('resize', this.onWindowResize)
        }
    }
}
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
}
</style>