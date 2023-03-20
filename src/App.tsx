import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, Checkbox, Container, Flex, Group, TextInput, Title } from '@mantine/core'
import { useAutoAnimate } from '@formkit/auto-animate/react'

type Tasks = {
  id: number,
  text: string,
  active: boolean,
  done: boolean
}

function HttpRequestComponent(){
  const [loading, setLoading] = useState<boolean>(false)
  const [tasks, setTasks] = useState<Tasks []>()
  const [failure, setFailure] = useState<boolean>(false)
  const inputReference = useRef<HTMLInputElement>(null)
  const [parent] = useAutoAnimate()
  const inputReference1 = useRef<HTMLInputElement>(null)
  const [allTasks, setAllTasks] = useState<Tasks []>()

  const onCreate = async (someText:string) => {
    await fetch("http://localhost:4000/todos", {method: "POST" , headers: {"Content-Type" : "application/json"}, body: JSON.stringify({text:someText})})
  } 

  const onSubmit = async () => {
    if (inputReference.current!.value !== ""){
      await onCreate(inputReference.current?.value ?? "")
      inputReference.current!.value = ""
      await onFetch()
    }
  }

  const onFetch = async () => {
    const req = await fetch("http://localhost:4000/todos", {method: "GET"})
    const response = await req.json()
    setTasks(response)
    setAllTasks(response)
  }
  const onUpdate = async (data:Tasks) => {
    await fetch(`http://localhost:4000/todos/${data.id}`, {method: "PUT",headers: {"Content-Type" : "application/json"}, body: JSON.stringify(data)})
  }
  const onToggle = async (data:Tasks) => {
    await onUpdate({...data, done : !data.done})
    await onFetch()
  }

  const onDelete = async (data:Tasks) => {
    await fetch(`http://localhost:4000/todos/${data.id}`, {method: "DELETE"})
  }

  const onCall = async (data:Tasks) => {
    await onDelete(data)
    await onFetch()
  } 

  const onErase = () => {
    setTasks(tasks)
  }

  const onSearch = async (e:ChangeEvent<HTMLInputElement>) => {
    const filteredValue = allTasks?.filter((todo) => String(todo.text).toLowerCase().includes(String(e.target.value).toLowerCase()))
    setTasks(filteredValue)
    
  }

  
  
  useEffect(() => { onFetch() },[])
  return(
    <Container>
      <Box ref={parent}>
        <TextInput ref={inputReference1} placeholder='Search a To-Do Task' onChange={onSearch} /> 
        {tasks && tasks.map(task => 
        <Group key={task.id} position={"apart"} m={4}>
          <Checkbox 
            checked = {task.done}
            onChange = {() => onToggle(task)}
            label = {task.text}
            size = "xl"
            color = "pink"
          />
          <Button onClick={() => onCall(task)}> Delete </Button>
      </Group>)}
      </Box>
      <Flex direction={"row"} gap={4}>
        <TextInput ref={inputReference} placeholder='Add new Task' /> 
        <Button onClick={() => onSubmit()}> Add </Button>
      </Flex>
      
    </Container>
  )
}

function App() {
  return (
    <div>
      <Title order={3} size="h1" weight={100} align="center" italic fw={700}>Riddhi's To-Do List</Title>
      <br></br>
      <div>
      <HttpRequestComponent />
    </div>
    </div>
  )
}

export default App
