import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "./components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "./components/ui/input";

export default function App() {
    const [numberOfParticles, setNumberOfParticles] = useState(100);
    const [speed, setSpeed] = useState(0.02);
    const [open, setOpen] = useState(false);
    return (
        <main className="w-full min-h-screen">
            <div className="absolute left-[50%] -translate-x-[50%] bottom-4 z-10 flex gap-2">
                <Button onClick={() => setOpen(true)}>Setting</Button>
                <Button variant="outline" onClick={async () => {
                    const thisNumber = numberOfParticles
                    setNumberOfParticles(0)
                    setTimeout(() => {
                        setNumberOfParticles(thisNumber)
                    }, 0)
                }}>Reset Position</Button>
            </div>
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Setting</DialogTitle>
                    </DialogHeader>
                    <span>Number of particles</span>
                    <div className="flex gap-2">
                        <Slider
                            max={1000}
                            step={1}
                            value={[numberOfParticles]}
                            onValueChange={([e]) => setNumberOfParticles(e)}
                        />
                        <Input
                            type="number"
                            className="w-20"
                            value={numberOfParticles}
                            onChange={(e) =>
                                setNumberOfParticles(Number(e.target.value))
                            }
                        />
                    </div>
                    <span>Speed</span>
                    <div className="flex gap-2">
                        <Slider
                            max={0.5}
                            step={0.01}
                            value={[speed]}
                            onValueChange={([e]) => setSpeed(e)}
                        />
                        <Input
                            type="number"
                            className="w-20"
                            value={speed}
                            onChange={(e) =>
                                setSpeed(Number(e.target.value))
                            }
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button>Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Scene numberOfParticles={numberOfParticles} speed={speed} />
        </main>
    );
}

function Particle(props: { position?: THREE.Vector3; speed?: number }) {
    const meshRef = useRef(null!);
    const position = useRef(props.position ?? new THREE.Vector3(0, 0, 0));
    const direction = useRef(
        new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize()
    );
    const speed = props.speed ?? 0.02;

    useFrame(() => {
        if (meshRef.current) {
            // Update position by adding a small step in the current direction
            position.current.addScaledVector(direction.current, speed);
            const ref = meshRef.current as THREE.Mesh;
            // Update mesh position
            ref.position.set(
                position.current.x,
                position.current.y,
                position.current.z
            );

            // Randomly change direction to create random walk
            if (Math.random() < 0.1) {
                direction.current = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize();
            }
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function Scene({
    numberOfParticles,
    speed,
}: {
    numberOfParticles: number;
    speed: number;
}) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ height: "100vh" }}
            className="z-0"
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {Array.from(new Array(numberOfParticles)).map((d) => (
                <Particle key={d} speed={speed} />
            ))}
            <OrbitControls />
        </Canvas>
    );
}
