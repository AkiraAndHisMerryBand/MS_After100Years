import {Mountain, CircleArrowRight, WavesHorizontal} from "lucide-react";
import Image from "next/image";
import "./home.css";
import Link from "next/link";


export default function Home() {
  return (
    <main className="top-page">

      <div className="rogo">
        <Image
          src="/images/rogo.png"
          alt="ロゴ"
          width={150}
          height={118}
        />
      </div>

      <div className="top-title">
        <h1>未来の生態系を、<br />つくろう。</h1>
      </div>

      <div className="environment-selection">
        <Link href="/setting?environment=land" className="environment-card land">
          <Mountain size={32} className="environment-icon"/>
          <p>地上</p>
          <span>land</span>
          <CircleArrowRight size={32} className="environment-icon"/>
        </Link>

        <Link href="/setting?environment=ocean" className="environment-card ocean">
          <WavesHorizontal size={32} className="environment-icon"/>
          <p>海底</p>
          <span>ocean</span>
          <CircleArrowRight size={32} className="environment-icon"/>
        </Link>

        <Link href="/setting?environment=cave" className="environment-card cave">
          <Image
              src="/images/cave.svg"
              alt="洞窟"
              width={38}
              height={38}
          />
          <p>洞窟</p>
          <span>cave</span>
          <CircleArrowRight size={32} className="environment-icon"/>
        </Link>
      </div>

    </main>
  );
}
