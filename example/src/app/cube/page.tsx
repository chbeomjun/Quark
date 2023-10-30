"use client"
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../page.module.css'
import ThreeDScene from './cube'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Cube demo&nbsp;
        </p>
      </div>

      <div className={styles.center}>

        <ThreeDScene />

      </div>
    </main>
  )
}
