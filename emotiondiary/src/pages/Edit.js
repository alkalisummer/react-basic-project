import { useNavigate, useSearchParams } from "react-router-dom";

const Edit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");
  const navigate = useNavigate();

  console.log("id : " + id, ", mode : " + mode);

  return (
    <div>
      <h1>Edit</h1>
      <p>이곳은 게시글 수정 페이지입니다.</p>
      <button onClick={() => setSearchParams({ who: "kihoon" })}>QS바꾸기</button>
      <button
        onClick={() => {
          navigate("./home");
        }}>
        Home으로 가기
      </button>
      <button
        onClick={() => {
          navigate(-1);
        }}>
        뒤로 가기
      </button>
    </div>
  );
};

export default Edit;
