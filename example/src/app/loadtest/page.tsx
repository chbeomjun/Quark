"use client"
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import ThreeDScene from './threedee'
import { useEffect } from 'react'
import * as FBXParser from 'fbx-parser'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    useEffect(() => {

        import * as fs from 'fs'
        const file = 'file.fbx'
        let fbx: FBXData
        try {
        // try binary file encoding
        fbx = parseBinary(fs.readFileSync(file))
        } catch (e) {
        // try text file encoding
        fbx = parseText(fs.readFileSync(file, 'utf-8'))
        }

    });

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
            This page is an test of loading FBX files for grengine.&nbsp;
        </p>
        <link href="index">Home</link>
      </div>

      <div className={styles.center}>

        <ThreeDScene />

      </div>

    </main>
  )
}
