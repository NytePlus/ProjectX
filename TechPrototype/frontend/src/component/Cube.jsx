import React, {useState, createContext, useContext, useReducer, Component, createRef, memo, useMemo} from 'react'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, IconButton, Switch, Typography} from "@mui/material";
import {useCube, useCubeDispatch, useLayers, useLayersDispatch, usePreview, usePreviewDispatch} from "../page/RepoPage";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

function File({item})
{
    const [hover, setHover] = useState(false)
    function onMouseEnterHandler()
    {
        setHover(true)
        // previewDispatch({type: 'preview',
        //     info: {
        //         layer: layer,
        //         name: name,
        //     }
        // });
    }
    function onMouseLeaveHandler()
    {
        setHover(false)
        // previewDispatch({type: 'endpreview',
        //     info: {
        //         layer: layer,
        //         name: name,
        //     }
        // });
    }
    return (<div style={{display: 'flex', width:'200px',
        background: hover?'white':'',
        boxShadow: hover?'0 0 10px rgba(0, 0, 0, 0.5)' : ''
    }} onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
        <InsertDriveFileOutlinedIcon sx={{mt:0.5}}/>
        <Typography sx={{mb:-0.5, whiteSpace:'nowrap'}} variant="subtitle1">{item.name}</Typography>
    </div>)
}

function Folder({name, layer, disChild, setDisChild})
{
    const dispatch = useLayersDispatch();
    const previewDispatch = usePreviewDispatch();
    const [hover, setHover] = useState(false)
    function onMouseEnterHandler()
    {
        setHover(true)
        previewDispatch({type: 'preview',
            info: {
                layer: layer,
                name: name,
            }
        });
    }
    function onMouseLeaveHandler()
    {
        setHover(false)
        previewDispatch({type: 'endpreview',
            info: {
                layer: layer,
                name: name,
            }
        });
    }
    function onMouseDownHandler()
    {
        if(disChild[0] !== layer || disChild[1] !== name)
        {
            if(disChild[0] !== '' || disChild[1] !== '')
                dispatch({type: 'remove',
                    info: {
                        layer: disChild[0],
                        name: disChild[1],
                    }
                })
            dispatch({type: 'changed',
                info: {
                    layer: layer,
                    name: name,
                }
            })
            setDisChild([layer, name])
        }
        else
        {
            dispatch({type: 'remove',
                info: {
                    layer: layer,
                    name: name,
                }
            })
            setDisChild(['', ''])
        }
    }
    return (<div style={{display: 'flex',  width:'200px',
        background: disChild[1]===name || hover?'white':'transparent',
        boxShadow: disChild[1]===name || hover?'0 0 10px rgba(0, 0, 0, 0.5)' : ''}}
                 onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}
                 onMouseDown={() => onMouseDownHandler()}>
        <FolderOutlinedIcon sx={{mt:0.5}}/>
        <Typography sx={{mb:-0.5, whiteSpace:'nowrap'}} variant="subtitle1">{name}</Typography>
    </div>)
}

function FrontSide()
{
    const [hover, setHover] = useState(false)
    const [transform3d, setTransform3d] = useState('')
    function onMouseEnterHandler() {
        setTransform3d('translate3d(1000px, -1414px, 1000px) rotateY(45deg) rotateX(45deg)')
        setHover(true)
    }

    function onMouseLeaveHandler() {
        setTransform3d('')
        setHover(false)
    }
    const state = useCube()
    return (
        <div style={{
            background: 'transparent',
            transform: state?`rotateX(-90deg) translateZ(300px) ${transform3d}` : `rotateX(-90deg) translateZ(120px)`
        }} className={'side'}
             onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
            <AdminPanelSettingsIcon sx={{opacity:0.5, color: '#4caf50', fontSize: 200}}/>
            {hover?<>
            <Typography sx={{whiteSpace: 'nowrap', color:'#4caf50'}} variant="h4">仓库状态 私有</Typography>
            <Switch color={'success'}/>
            </>:<></>}
        </div>
)
}

function FileSide({dir, Zoffset}) {
    const state = useCube()
    const [disChild, setDisChild] = useState(['', ''])
    const [transform3d, setTransform3d] = useState('')
    const [background, setBackground] = useState('')
    const [overflow, setOverflow] = useState('hidden')
    const preview = usePreview()

    function onMouseEnterHandler() {
        setTransform3d('translate3d(1000px, -1414px, 1000px) rotateY(45deg) rotateX(45deg)')
        setBackground('#ffffffe6')
        setOverflow('')
    }

    function onMouseLeaveHandler() {
        setTransform3d('')
        setBackground('')
        if(dir.path !== preview) setOverflow('hidden')
    }
    if(dir && dir.files.length >= 0)
        return (
            <>
                <div style={{
                    background: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    overflow: `${dir.path !== preview ? overflow : ''}`,
                    transform: state ? `rotateX(-90deg) translateZ(${Zoffset}px) ${transform3d}` :
                        `rotateX(-90deg) translateZ(${Zoffset * 0.6}px) ${transform3d}`
                }} className={'side'}
                     onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
                    <ViewInArIcon sx={{color: '#eeeeee', fontSize: 200}}/>
                </div>
                <div style={{
                    background: 'transparent', overflow: `${dir.path !== preview ? overflow : ''}`,
                    transform: state ? `rotateX(-90deg) translateZ(${Zoffset + 10}px) ${transform3d}` :
                        `rotateX(-90deg) translateZ(${(Zoffset + 10) * 0.6}px) ${transform3d}`,
                }} className={'side'}
                     onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
                    <div style={{height: 'min-content', width: 'min-content', background: `${background}`}}>
                        {(dir.path !== preview) ?
                            <Typography sx={{mb: -0.5, whiteSpace: 'nowrap'}} variant="h6">{dir.path}</Typography> :
                            <Typography sx={{mb: -0.5, whiteSpace: 'nowrap'}} variant="h6">Preview</Typography>}
                        {dir.files.map((item) => {
                            if (item.type === 'file')
                                return <File item={item}/>
                            else
                                return <Folder name={item.name} layer={dir.path}
                                               disChild={disChild} setDisChild={setDisChild}/>
                        })}
                    </div>
                </div>
            </>
        )
}

function LeftSide() {
    const state = useCube();
    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            padding: 10,
            transition: 'transform 0.5s ease-out',
            transform: state ? 'rotateY(-90deg) translateZ(180px) rotateZ(90deg) translateX(20px) translateY(-15px)' :
                'rotateY(-90deg) translateZ(100px) rotateZ(90deg) translateX(20px) translateY(-15px)'
        }}>
            Side
        </div>
    )
}

function BottomSide() {
    const state = useCube();
    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            padding: 10,
            transition: 'transform 0.5s ease-out',
            transform: state ? 'rotateY(180deg) translateZ(250px) translateX(10px)' :
                'rotateY(180deg) translateZ(125px) translateX(10px)'
        }}>
        </div>
    )
}

function TopSide() {
    const state = useCube();
    const dispatch = useCubeDispatch();
    return (
        <>
            <div style={{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', padding: 10,
                transform: state ? 'rotateY(180deg) translateZ(-270px) translateX(10px)' :
                    'rotateY(180deg) translateZ(-115px) translateX(10px)'
            }} className={'side'}>
                <IconButton sx={{m: "37%"}} size="large" color="inherit" onClick={() => {
                    dispatch({type: 'switch'})
                }}>
                    <ViewInArIcon/>
                </IconButton>
            </div>
            <div className={'side'} style={{
                width: 1, height: 1, marginLeft: '200px',
                background: 'transparent',
                transform: state ? 'rotateY(180deg) translateZ(-410px) translateX(10px)' :
                    'rotateY(180deg) translateZ(-110px) translateX(10px)'
            }}>
                {state ? <ReportProblemOutlinedIcon sx={{opacity: 0.5, fontSize: 200, color: '#64b5f6'}}/> : <></>}
            </div>
        </>
    )
}
function RightStar() {
    const state = useCube()
    const [hover, setHover] = useState(false)
    const [transform3d, setTransform3d] = useState('')
    function onMouseEnterHandler() {
        setTransform3d('rotateY(-45deg)  rotateX(45deg)')
        setHover(true)
    }

    function onMouseLeaveHandler() {
        setTransform3d('')
        setHover(false)
    }
    return (
        <div className={'side-option'} style={{
            transform: state ? `rotateY(90deg) translateZ(230px) rotateZ(-90deg) translateX(-10px) ${transform3d}` :
                'rotateY(90deg) translateZ(110px) rotateZ(-90deg) translateX(-10px)',
            background: hover?'white':'transparent'
        }}
             onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
            <StarBorderRoundedIcon sx={{opacity: 0.5, fontSize: 150, color: '#424242'}}/>
            {hover?<Typography sx={{whiteSpace: 'nowrap', color: '#424242'}} variant="h4">收藏</Typography>:<></>}
        </div>)
}

function RightUpload(){
    const state = useCube()
    const [hover, setHover] = useState(false)
    const [transform3d, setTransform3d] = useState('')
    function onMouseEnterHandler() {
        setTransform3d('rotateY(-45deg)  rotateX(45deg)')
        setHover(true)
    }

    function onMouseLeaveHandler() {
        setTransform3d('')
        setHover(false)
    }
    return (
        <div className={'side-option'} style={{
            transform: state ? `rotateY(90deg) translateZ(330px) rotateZ(-90deg) translateX(-10px) ${transform3d}` :
                'rotateY(90deg) translateZ(110px) rotateZ(-90deg) translateX(-10px)',
            background: hover?'white':'transparent'
        }}
             onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
            <FileUploadOutlinedIcon sx={{opacity: 0.5, fontSize: 150, color: '#424242'}}/>
            {hover?<Typography sx={{whiteSpace: 'nowrap', color: '#424242'}} variant="h4">上传文件</Typography>:<></>}
        </div>)
}

function RightSet(){
    const state = useCube()
    const [hover, setHover] = useState(false)
    const [transform3d, setTransform3d] = useState('')
    function onMouseEnterHandler() {
        setTransform3d('rotateY(-45deg)  rotateX(45deg)')
        setHover(true)
    }

    function onMouseLeaveHandler() {
        setTransform3d('')
        setHover(false)
    }
    return (
        <div className={'side-option'} style={{
            transform: state ? `rotateY(90deg) translateZ(440px) rotateZ(-90deg) translateX(-10px) ${transform3d}` :
                'rotateY(90deg) translateZ(110px) rotateZ(-90deg) translateX(-10px)',
            background: hover?'white':'transparent'
        }}
             onMouseEnter={() => onMouseEnterHandler()} onMouseLeave={() => onMouseLeaveHandler()}>
            <SettingsOutlinedIcon sx={{opacity: 0.5, fontSize: 150, color: '#424242'}}/>
            {hover?<Typography sx={{whiteSpace: 'nowrap', color: '#424242'}} variant="h4">设置</Typography>:<></>}
        </div>)
}

function RightSide() {
    const state = useCube();
    return (
        <>
            <div className={'side'} style={{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                padding: 10,
                transform: state ? 'rotateY(90deg) translateZ(200px) rotateZ(-90deg) translateX(-10px)' :
                    'rotateY(90deg) translateZ(110px) rotateZ(-90deg) translateX(-10px)'
            }}>
            </div>
        </>
    )
}

export function FileFlat({dir}) {
    const state = useCube()
    const [display, setDisplay] = useState(true)
    const dispatch = useLayersDispatch();

    function back() {
        dispatch({
            type: 'remove',
            info: {
                layer: dir.path.split('/').slice(0, -1).join('/'),
                name: '',
            }
        })
    }

    return (<div style={{
        width: '100%', height: '100%', overflow: 'scroll', align: 'begin',
        transition: 'opacity 0.5s ease-out', opacity: state ? '0': '1', background: "white"
    }}>
        <div style={{display: 'flex'}}>
            <Typography sx={{mb: -0.5, whiteSpace: 'nowrap'}} variant="h6">{dir.path}</Typography>
            <Box sx={{flexGrow: 1}}/>
        </div>
        <div style={{display: 'flex'}}>
            <IconButton size="large" color="inherit" onClick={back}>
                <ArrowBackIcon/>
            </IconButton><Box sx={{flexGrow: 1}}/>
        </div>
        {dir.files.map((item) => {
            if (item.type === 'file')
                return <File item={item}/>
            else
                return <Folder name={item.name} layer={dir.path} display={display} setDisplay={setDisplay}/>
        })}
    </div>)
}

export function Cube({prop}){
    const state = useCube()
    return (
        <div className={['cube', !state && 'cube-rotate'].join(' ')}>
            <FileCube prop={prop}/>
            <LeftSide></LeftSide>
            <TopSide></TopSide>
            <BottomSide></BottomSide>
            <RightSide></RightSide>
            <RightStar/>
            <RightUpload/>
            <RightSet/>
        </div>)
}

function FileCube({prop}) {
    const layers = useLayers()
    const preview = usePreview()
    return (
        <>
            <FrontSide></FrontSide>
            {layers.map((path, index) => {
                return (<FileSide dir={prop.find(item => item.path === path)}
                                  Zoffset={-400 / layers.length * index + 200}></FileSide>)
            })}
            {
                preview !== '' ? <FileSide dir={prop.find(item => item.path === preview)} Zoffset={-200}>Preview</FileSide> :
                    <FileSide dir={{path: '', files: []}} Zoffset={-200}>Preview</FileSide>
            }
        </>
    )
}