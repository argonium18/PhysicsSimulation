import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

async function main() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true); // 第二引数でアンチエイリアス有効にする

    async function createScene() {
        const ammo = await Ammo();

        const scene = new BABYLON.Scene(engine);

        // 物理エンジンを初期化
        const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        const physicsPlugin = new BABYLON.AmmoJSPlugin(ammo);
        scene.enablePhysics(gravityVector, physicsPlugin);

        // カメラを作成
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2.5,
            3,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
        camera.attachControl(canvas, true);

        // ライトを作成
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        // 地面を作成（物理演算用）
        const ground = BABYLON.MeshBuilder.CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {
                mass: 0,
                restitution: 0.9,
                friction: 0.5
            },
            scene
        );

        // 箱を作成（物理演算付き）
        const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
        box.position.y = 2;

        box.physicsImpostor = new BABYLON.PhysicsImpostor(
            box,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {
                mass: 1,
                restitution: 0.9,
                friction: 0.5
            },
            scene
        );

        // デバッグ用のPhysicsViewerを追加（必要な場合）
        const physicsViewer = new BABYLON.Debug.PhysicsViewer();
        physicsViewer.showImpostor(box.physicsImpostor);
        physicsViewer.showImpostor(ground.physicsImpostor);

        return scene;
    }

    const scene = await createScene();

    // レンダーループ
    engine.runRenderLoop(() => {
        scene.render();
    });

    // リサイズイベント処理
    window.addEventListener('resize', () => {
        engine.resize();  // エンジンのリサイズを行う
        canvas.width = window.innerWidth;  // canvasの幅をウィンドウサイズに合わせる
        canvas.height = window.innerHeight; // canvasの高さをウィンドウサイズに合わせる
    });

    // 初期サイズ調整
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('DOMContentLoaded', () => {
    main().catch(console.error);
});
