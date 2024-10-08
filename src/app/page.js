import React from "react";
import ExcelReader from "./components/ExcelReader";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-right">
          טבלאות פיצויים לעובדים
        </h1>

        <ExcelReader />
      </div>
    </>
  );
};

export default Home;
