import { useState, useEffect } from "react";

//ユーザーリスト
function UsersList (){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // APIで取得
  const fetchUsers = async() => {
    // 成功でもエラーでもメッセージを正しく表示するために
    // 取得開始時にフラグを更新してからAPI通信開始する
    setLoading(true);
    setError(false);

    try{
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("通信に失敗しました");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return(
    <div>
      {/* API再取得ボタン */}
      <button onClick={fetchUsers}>
        再取得
      </button>

      {/* API通信表示 */}
      {/* シンプルにするならこの条件を復活させる */}
      {/* if (loading){
        return <p>Loading...</p>
      }

      if (error){
        return <p>通信に失敗しました。時間をおいて再度やり直して下さい。</p>
      } */}

      { loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>通信に失敗しました。時間をおいて再度やり直してください。</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>{user.name}</p>
              <p>{user.username}</p>
              <small>{user.email}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UsersList;