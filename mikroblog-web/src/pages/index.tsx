import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql"

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <>
      <NavBar />
  
      {!data ?
        <div>
          loading...
        </div>
        : data.posts.map((p) =>
          <div key={p.id}>
            {p.title}
          </div>)}
    </>
  );
}
export default withUrqlClient(createUrqlClient)(Index);
