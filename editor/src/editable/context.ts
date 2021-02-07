import {createContext, useContext, useEffect, useMemo} from "react";
import {ComponentStateData, StateData} from "../state/componentsState";
import {isStateObj} from "../editor/state/ComponentStateMenu";

type State = {
    uid: string,
    derivedState: ComponentStateData,
    registerDefaultProp: (key: string, value: any) => void,
    parentPath: string[],
    overrideState: {
        [key: string]: StateData
    },
    isRoot: boolean,
    registerWithParent: (uid: string) => () => void,
    getStateValue: (key: string) => any,
}

export const EditableContext = createContext<State>({
    uid: '',
    derivedState: {},
    registerDefaultProp: () => {},
    parentPath: [],
    overrideState: {},
    isRoot: true,
    registerWithParent: () => () => {},
    getStateValue: () => {},
})

export const useEditableContext = (): State => {
    return useContext(EditableContext)
}

type Options = {
    defaultValue?: any,
}

export const useInheritedState = (id: string): StateData => {
    const {overrideState} = useEditableContext()
    return useMemo(() => {
        const state: StateData = {}
        Object.entries(overrideState).forEach(([key, value]) => {
            if (key === id) {
                Object.entries(value).forEach(([propKey, propValue]) => {
                    state[propKey] = propValue
                })
            }
        })
        return state
    }, [overrideState])
}

const getSafeDefaultValue = (defaultValue: any) => {
    if (isStateObj(defaultValue)) {
        return defaultValue.value
    }
    return defaultValue
}

export const useEditableProp = (key: string, options: Options = {}) => {

    const {
        derivedState,
        registerDefaultProp,
    } = useEditableContext()

    useEffect(() => {
        registerDefaultProp(key, options.defaultValue)
    }, [])

    return derivedState[key]?.value ?? getSafeDefaultValue(options.defaultValue)

}

export const useEditableProps = (props: {
    [key: string]: Options,
}): {
    [key: string]: any,
} => {

    const {
        derivedState,
        registerDefaultProp,
    } = useEditableContext()

    useEffect(() => {
        Object.entries(props).forEach(([key, options]) => {
            registerDefaultProp(key, options.defaultValue)
        })
    }, [])

    const combinedState = useMemo(() => {

        const state: {
            [key: string]: any,
        } = {}

        Object.entries(props).forEach(([key, options]) => {
            state[key] = derivedState[key]?.value ?? getSafeDefaultValue(options.defaultValue)
        })

        return state

    }, [derivedState])

    return combinedState

}