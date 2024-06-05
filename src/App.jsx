import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [first, setfirst] = useState('blue');
  const [second, setsecond] = useState('black');
  const [third, setthird] = useState('black');
  const [firstb, setfirstb] = useState('blue');
  const [secondb, setsecondb] = useState('lightcyan');
  const [thirdb, setthirdb] = useState('lightcyan');
  const [percent, setpercent] = useState(0);

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const tod = JSON.parse(todoString);
      setTodos(tod);
    }
  }, []);

  useEffect(() => {
    let countTodo = todos.filter((item)=>{
      if(item.isCompleted) return item;
    })
    const todoLen = todos.length;
    const compLen = countTodo.length;
    const perComplete = Math.floor((compLen/todoLen) * 100);
    if(todoLen === 0){
      setpercent(0);
    }
    else{
      setpercent(perComplete);
    }
  }, [todos])

  const saveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleEdit = (e, id) => {
    const t = todos.find(i => i.id === id);
    setTodo(t.todo);
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTodo("");
    saveToLS(updatedTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map(item => {
      if (item.id === id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    switch (filter) {
      case 'ALL':
        setfirst('blue');
        setsecond('black');
        setthird('black');
        setfirstb('blue');
        setsecondb('lightcyan');
        setthirdb('lightcyan');
        break;
      case 'ACTIVE':
        setfirst('black');
        setsecond('blue');
        setthird('black');
        setfirstb('lightcyan');
        setsecondb('blue');
        setthirdb('lightcyan');
        break;
      case 'COMPLETED':
        setfirst('black');
        setsecond('black');
        setthird('blue');
        setfirstb('lightcyan');
        setsecondb('lightcyan');
        setthirdb('blue');
        break;
      default:
        break;
    }
  };

  const calculateWidth = () => {
    const width = (percent * 300) / 100; 
      return `${width}px`; 
  };

  return (
    <>
      <div className='w-full h-full bg-sky-50 flex flex-col p-5 rounded-lg bg-opacity-95'>
        <div className='flex gap-1 justify-center'>
          <div className='w-[500px] h-8 border border-gray-400 mx-3 my-2 pt-[3px] rounded-md bg-white'>
            <input onChange={handleChange} value={todo} type="text" placeholder='Add Tasks' className='w-full h-6 pl-3 outline-none text-sm' />
          </div>
          <button onClick={handleAdd} disabled={todo.length <= 3} className='border text-white px-7 h-[32px] mt-2 rounded-md bg-sky-400 font-bold text-sm disabled:bg-sky-400 disabled:drop-shadow-none hover:drop-shadow-md transition-all hover:bg-sky-600 duration-300'>ADD</button>
        </div>
        <div className='flex flex-col ml-6 gap-2 mt-2'>
          <div className='text-lg font-semibold'>You're {percent}% done!</div>
          <div className='w-[300px] h-3 border border-gray-300 rounded-xl'>
            <div style={{width: calculateWidth()}} className={`h-3 rounded-xl bg-green-400`}></div>
          </div>
        </div>
        <div className='w-full h-[250px] m-auto'>
          <div className='flex w-1/2 m-auto mt-4 mb-3 items-center justify-center text-sm font-sans'>
            <div onClick={() => handleFilterChange('ALL')} className='flex flex-col items-center gap-2 pt-2 cursor-pointer hover:bg-white transition-all duration-300'>
              <div style={{ color: first }}>ALL</div>
              <div style={{ borderColor: firstb }} className='w-[80px] border border-sky-50'></div>
            </div>
            <div onClick={() => handleFilterChange('ACTIVE')} className='flex flex-col items-center gap-2 pt-2 cursor-pointer hover:bg-white transition-all duration-300'>
              <div style={{ color: second }}>ACTIVE</div>
              <div style={{ borderColor: secondb }} className='w-[100px] border'></div>
            </div>
            <div onClick={() => handleFilterChange('COMPLETED')} className='flex flex-col items-center gap-2 pt-2 cursor-pointer hover:bg-white transition-all duration-300'>
              <div style={{ color: third }}>COMPLETED</div>
              <div style={{ borderColor: thirdb }} className='w-[150px] border border-sky-50'></div>
            </div>
          </div>
          <div className='w-full m-auto h-48 overflow-auto overflow-y-auto no-scrollbar'>
            {todos
              .filter(item => {
                if (filter === 'ALL') return true;
                if (filter === 'ACTIVE') return !item.isCompleted;
                if (filter === 'COMPLETED') return item.isCompleted;
                return true;
              })
              .map(item => (
                <div key={item.id} className='px-5 m-auto mt-3 w-[300px] h-9 border border-gray-300 rounded-md flex justify-between items-center text-base'>
                  <div className='flex gap-4'>
                    <input name={item.id} onChange={handleCheckbox} className='w-3' type="checkbox" checked={item.isCompleted} />
                    <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                  </div>
                  <div className='flex gap-3 justify-center'>
                    <img onClick={(e) => { handleEdit(e, item.id) }} src="/edit.svg" alt="" width="20px" height="20px" className='cursor-pointer' />
                    <img onClick={(e) => { handleDelete(e, item.id) }} src="/delete.svg" alt="" width="18px" height="18px" className='cursor-pointer' />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
