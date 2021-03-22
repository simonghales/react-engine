import React, {memo, MutableRefObject, useMemo, useState} from "react"
import {styled} from "../ui/sitches.config";
import {NodeRendererProps} from "react-sortable-tree";
import {FaCube, FaFolder, FaFolderOpen} from "react-icons/fa";
import {StyledHeading} from "../ui/typography";
import {useComponentName, useGroup} from "../state/main/hooks";
import {useComponent} from "../state/components/hooks";

const StyledWrapper = styled('div', {
    paddingRight: '$2',
})

const StyledContainer = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    height: '32px',
    columnGap: '$1b',
    padding: '$1',
    cursor: 'pointer',
    borderRadius: '$1',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    variants: {
        theme: {
            active: {
                backgroundColor: 'rgba(0,0,0,0.5)',
            },
            parentDragging: {},
        },
    },
})

const StyledGrabHandle = styled('div', {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const StyledNameWrapper = styled('div', {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    '> *:not(:first-child)': {
        marginLeft: '$1b',
    }
})

const StyledName = styled(StyledHeading, {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
})

const useGroupData = (id: string) => {
    const group = useGroup(id)
    console.log('group', group, id)
    return group?.name ?? ''
}

const useComponentData = (id: string) => {
    const storedName = useComponentName(id)
    const component = useComponent(id)
    return storedName || (component?.name ?? '')
}

const useName = (id: string, isGroup: boolean) => {

    const componentName = useComponentData(id)
    const groupName = useGroupData(id)

    return isGroup ? groupName : componentName

}

const Component: React.FC<{
    id: string,
    isGroup: boolean,
    canDrag: boolean,
    expanded: boolean,
    hasChildren: boolean,
    isLandingPadActive: boolean,
    connectDragSource: NodeRendererProps['connectDragSource'],
    onIconClickRef: MutableRefObject<() => void>,
}> = ({
          id,
            isGroup,
          canDrag,
          expanded,
          hasChildren,
          isLandingPadActive,
          connectDragSource,
          onIconClickRef
      }) => {

    const name = useName(id, isGroup)

    const icon = useMemo(() => {
        if (isGroup) {
            if (expanded) {
                return <FaFolderOpen size={10}/>
            }
            return <FaFolder size={10}/>
        }
        return <FaCube size={10}/>
    }, [hasChildren, expanded, isGroup])

    const {
        onClick,
    } = useMemo(() => ({
        onClick: (event: MouseEvent) => {
            console.log('click')
            event.stopPropagation()
        },
    }), [])

    const handle = useMemo(() => {
        const content = (
            <StyledGrabHandle onClick={event => {
                onIconClickRef.current()
                event.stopPropagation()
            }}>
                {icon}
            </StyledGrabHandle>
        )
        return canDrag ? connectDragSource(
            <div className="dragHandle">
                {content}
            </div>, {
                dropEffect: 'copy',
            }) : content;
    }, [onIconClickRef, icon, canDrag])

    return (
        <StyledWrapper>
            <StyledContainer onClick={onClick}
                             theme={
                                 isLandingPadActive ? 'active' : ''
                             }>
                {handle}
                <StyledNameWrapper>
                    <StyledName>
                        {name}
                    </StyledName>
                </StyledNameWrapper>
            </StyledContainer>
        </StyledWrapper>
    )
}

export const ScreenTreeNode = memo(Component)