import Layout from "../../components/Layout";
import Counter from "../../components/Counter";


const CounterPage = (props)=>{

    return (
        <Layout content={false}>
            <Counter />
        </Layout>
    )
}

export default CounterPage