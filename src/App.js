import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

//数値カウンター（ボタン）
function Counter({ count, setCount}) {
  return(
    <>
      <h1>{ count }</h1>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
      <br></br>
      <button onClick={() => {
        if ( count > 0){
          setCount( count - 1);
        }
      }}>
        -1
      </button>
    </>
  );
}

//ユーザー情報の表示
function UserList({ users }){
  return(
    <ul>
      {users.map((user, index) => (
      <li key={index}>{user}</li>
      ))}
    </ul>
  );
}

// フォーム
// function InputForm ({text, setText, list, setList}){
//   return(
//     <>
//       <input 
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <button onClick={() => {
//         setList([...list, text]);
//         setText("");
//       }}>
//         追加
//       </button>

//       <ul>
//         {list.map((item, index) => (
//           <li key={index}>{item}</li>
//         ))}
//       </ul>
//     </>
//   );
// }


//コンポーネントフォーム
function InputForm ({text, setText, list, setList}){
  return(
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => {
        if (text.trim() === "") return; 
        setList([...list, text]);
        setText("");
      }}>
        追加
      </button>
    </div>
  )
}

//ユーザーリスト
function UserLists ({ list, setList }){
  return(
    <div>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => {
              const newList = list.filter((_, i) => i !== index);
              setList(newList);
            }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ListItem({ item, list, setList, setText, setEditId }){

  const formattedCreatedAt = item.createdAt.toLocaleString("ja-JP",{
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedUpdatedAt = item.updatedAt.toLocaleString("ja-JP",{
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUpdated = item.createdAt.getTime() !== item.updatedAt.getTime();

  return(
    <li className={`todo-item ${item.completed ? "completed" : ""}`}>
      {/* 投稿の表示 */}
      <span>{item.text}</span>
      {/* ({item.date ? new Date(item.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : ""}) */}
      <small>
        {"　"} {/* 投稿内容と時刻の間隔を開けるため */}
        {formattedCreatedAt}
      </small>
      {isUpdated && (
        <>
          <br/>
          <small className='todo-date'>
            最終更新：{formattedUpdatedAt}
          </small>
        </>
      )}
      

      {/* 編集 */}
      <button className="edit-button"
      onClick={() =>{
        setText(item.text);
        setEditId(item.id);
      }}>
        編集
      </button>

      {/* 削除 */}
      <button className="delete-button"
      onClick={() => {
        const newArray = list.filter(listItem => listItem.id !== item.id)
        setList(newArray);
      }}>
        削除
      </button>

      {/* 完了フラグ */}
      <button className="complete-button"
      onClick={() =>{
        const newFlagArray = list.map((listItem) =>{
          if (listItem.id === item.id){
            return{
              ...listItem,
              completed: !listItem.completed
            };
          } else {
            return listItem;
          }
        });
        setList(newFlagArray);
      }}>
        {item.completed ? "完了" : "未完了"}
      </button>
    </li>
  );
}

// 投稿一覧表示
function TodoList({list, setList, setText, setEditId, sortedList}){
  return(
    <div>
      <ul>
        {sortedList.map((item) => (
          <ListItem 
            item={item}
            list={list}
            setList={setList}
            setText={setText}
            setEditId={setEditId}
            sortedList={sortedList}
          />
        ))}
      </ul>
    </div>
  )
}

// TODOインプットフォーム
function TodoInputForm({text, setText, editId, setEditId, list, setList}) {
  const now = new Date();
  return(
    <div>
      <p>入力フォーム</p>
      {editId !== null && (
        <p>✏️ 編集中です</p>
      )}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          editId !== null ? "TODOを編集中" : "TODOを入力" 
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if(text.trim() === "") return;

            if(editId !== null) {
              const newList = list.map((item) => {
                if (item.id === editId) {
                  return{
                    ...item,
                    text: text,
                    updatedAt: now
                  };
                } 
                return item;
              });
              setList(newList);
              setText("");
              setEditId(null);
            } else {
                setList([...list, {
                  id: Date.now(),
                  text: text,
                  createdAt: now,
                  updatedAt: now,
                  completed: false
                }]);
                setText("");
              }
            }
          }}
      />
    </div>
  );
}

// フィルターボタン(state毎のボタン)
function FilterButtons({setFilter, filter}) {
  return(
    <div>
      <button className={`filter-button ${filter === "all" ? "active-button" : ""}`}onClick={() => setFilter("all")}>
        全て
      </button>
      <button className={`filter-button ${filter === "completed" ? "active-button" : ""}`}onClick={() => setFilter("completed")}>
        完了済み
      </button>
      <button className={`filter-button ${filter === "incomplete" ? "active-button" : ""}`}onClick={() => setFilter("incomplete")}>
        未完了
      </button>
    </div>
  );
}

// ソートボタン
function SortButtons({setSortOrder, sortOrder}) {
  return (
    <div>
      <button className={`sort-button ${sortOrder === "newest" ? "active-button" : ""}`}onClick={() => setSortOrder("newest")}>
        新しい順
      </button>
      <button className={`sort-button ${sortOrder === "oldest" ? "active-button" : ""}`}onClick={() => setSortOrder("oldest")}>
        古い順
      </button>
    </div>
  )
}

// 検索用フォーム
function SearchForm({searchText, setSearchText}){
  return(
    <div>
      <p>検索フォーム</p>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder='検索ワードを入力'
      />
    </div>
  )
}

// 件数表示
function DisplayCount({filteredCount}){
  return (
    <div>
      <p>件数：{filteredCount}件</p>
    </div>
  )
}


function App(){
  // const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [list, setList] = useState(()=> {
    try{
      const saved = localStorage.getItem("list");
      if (!saved) return [];

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return [];

      return parsed.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
      }));
    } catch (e){
      console.error("localStorage parse error", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  // フラグのstate別フィルター後表示用配列
  const filteredList = list.filter((item) =>{
    if (filter === "all")
    return item.text.includes(searchText);

    if (filter === "incomplete")
    return !item.completed && item.text.includes(searchText);

    if (filter === "completed")
    return item.completed && item.text.includes(searchText);
  });

  // 表示件数
  const filteredCount = filteredList.length //件数だけ渡せば良いのでlength

  // ソート
  const sortedList = [...filteredList]; // 元データ(list)のstateを直接変更しないようにスプレッド構文でコピーした配列にソートをかける
    if (sortOrder === "newest") {
      sortedList.sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }

    if (sortOrder === "oldest") {
      sortedList.sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime()
      });
    }

    // API
    useEffect(() => {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          if (!response.ok){ //API通信に失敗した時に.catchに飛ばす（fetchは404なども通信成功としてしまうため）
            throw new Error("通信に失敗しました")
          }
          return response.json();
        })

        .then((data) => {
          setUsers(data);
          setLoading(false);
        })

        .catch((error) => {
          console.error(error);
          setError(true);
          setLoading(false);
        });
    }, []);

    // if (loading){
    //   return <p>Loading...</p>
    // }

    // if (error){
    //   return <p>通信に失敗しました。時間をおいて再度やり直して下さい。</p>
    // }

  return (
    <div>
      {/* <Counter count={count} setCount={setCount}></Counter> */}
      {/* <UserList users={users}></UserList> */}
      {/* <InputForm text={text} setText={setText} list={list} setList={setList}></InputForm> */}
      {/* <UserLists list={list} setList={setList}></UserLists> */}
      <TodoInputForm text={text}
                setText={setText} 
                editId={editId}
                setEditId={setEditId}
                list={list}
                setList={setList}
      />
      <TodoList list={list}
                setList={setList}
                text={text} 
                setText={setText} 
                editId={editId} 
                setEditId={setEditId} 
                searchText={searchText}
                setSearchText={setSearchText}
                sortedList={sortedList}
      />
      <SortButtons setSortOrder={setSortOrder}
                   sortOrder={sortOrder}
      />
      <FilterButtons setFilter={setFilter}
                     filter={filter}
      />
      <SearchForm searchText={searchText}
                  setSearchText={setSearchText}
      />
      <DisplayCount filteredCount={filteredCount}
      />

      {/* 検索結果メッセージ */}
      {filteredList.length === 0 && (
        <p>検索結果がありません</p>
      )}

      {/* 完了したTODOをまとめて削除 */}
      <button onClick={() => {
        const deleteArray = list.filter((item) => {
          return !item.completed
        });
        setList(deleteArray);
      }}>
        完了済み削除
      </button>

      {/* API通信表示 */}
      { loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>通信に失敗しました。時間をおいて再度やり直してください。</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
