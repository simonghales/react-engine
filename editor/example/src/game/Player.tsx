import React, {useEffect, useRef} from "react"
import {Sphere} from "@react-three/drei";
import {Editable, EditableGrabbable, useEditableProp, useGrabbableMesh} from "rgg-editor";
import {useDraggableMesh} from "../../../src/three/useDraggableMesh";

export const Player: React.FC = () => {

    const x = useEditableProp('x', {
        defaultValue: 0,
    })

    const y = useEditableProp('y', {
        defaultValue: 0,
    })

    const z = useEditableProp('z', {
        defaultValue: 0,
    })

    const [ref] = useDraggableMesh()

    return (
        <EditableGrabbable>
            <group position={[x, y, z]} ref={ref}>
                <Sphere position={[0, 0, 1]}>
                    <meshBasicMaterial color="red" />
                </Sphere>
            </group>
        </EditableGrabbable>
    )
}

Player.displayName = 'Player'

const PlayerEditable: React.FC = () => {
    return (
        <Editable id="player">
            <Player/>
        </Editable>
    )
}

export default PlayerEditable