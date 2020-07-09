import Link from 'next/link'
import { Layout } from 'antd';
const { Footer } = Layout;

export default function Foot(props){
  return (
    <div className="foot" >
      Explorer Design ©2020 Created by &nbsp;
      <Link href="https://github.com/Explorer-Wu">
        <a>Explorer Wu</a>
      </Link>
    </div>
  )
}