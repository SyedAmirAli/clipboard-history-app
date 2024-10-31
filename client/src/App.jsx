/* eslint-disable no-unused-vars */
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import assets from "./assets";
import { io } from "socket.io-client";

function sliceText(text = "", limit = 100, end = "...") {
    if (text.length <= limit) return text;

    return text.slice(0, limit) + end;
}

export default function App() {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState({ status: false, data: undefined });

    useEffect(function () {
        (async function () {
            try {
                setLoading(true);
                setError({ status: false, data: undefined });

                const response = await fetch(window.route("/histories"));
                const result = await response.json();
                setData(result);
            } catch (error) {
                setData(null);
                setError({ ...error, status: true, data: error });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(
        function () {
            var socket = io(window.route());

            socket.on("new__history", function ({ history }) {
                console.log({ "New History": history, data });

                setData(function (prevState) {
                    if (Array.isArray(prevState)) {
                        if (prevState.some((state) => state.id === history.id))
                            return prevState;

                        const newState = [history, ...prevState];
                        return newState;
                    } else console.warn("History Stack Not Found!");
                });
            });
        },
        [data]
    );

    // console.log({ isLoading, error, data });

    return (
        <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full p-6 bg-slate-800 rounded-xl">
                <h1 className="text-2xl font-bold text-secondary">
                    Recent Clipboard Histories:
                </h1>

                <div className="w-full mt-3">
                    <nav className="w-full border-b border-solid border-slate-700 pb-2 mb-3">
                        <ul className="flex gap-5 justify-between items-center bg-slate-700 pt-2.5 pb-1 rounded-md px-4 w-full">
                            <li className="group active">
                                <a
                                    href="#recent"
                                    className="uppercase items-center mb-px justify-center font-bold text-slate-200 fill-slate-200 flex gap-1.5 duration-500 group-hover:text-secondary group-hover:fill-secondary group-hover:[.active]-wide group-[.active]:text-secondary group-[.active]:fill-secondary"
                                >
                                    <i className="size-4 block">
                                        {assets.svg.comment}
                                    </i>
                                    <span className="block pt-1">recent</span>
                                </a>

                                <p className="w-0 h-[3px] bg-secondary mb-1 group-hover:w-full group-[.active]:w-full duration-500"></p>
                            </li>
                            <li className="group">
                                <a
                                    href="#pinned"
                                    className="uppercase items-center mb-px justify-center font-bold text-slate-200 fill-slate-200 flex gap-1.5 duration-500 group-hover:text-secondary group-hover:fill-secondary group-hover:[.active]-wide group-[.active]:text-secondary group-[.active]:fill-secondary"
                                >
                                    <i className="size-3.5 block">
                                        {assets.svg.pin}
                                    </i>
                                    <span className="block pt-1">pinned</span>
                                </a>

                                <p className="w-0 h-[3px] bg-secondary mb-1 group-hover:w-full group-[.active]:w-full duration-500"></p>
                            </li>
                            <li className="group">
                                <a
                                    href="#secret"
                                    className="uppercase items-center mb-px justify-center font-bold text-slate-200 fill-slate-200 flex gap-1.5 duration-500 group-hover:text-secondary group-hover:fill-secondary group-hover:[.active]-wide group-[.active]:text-secondary group-[.active]:fill-secondary"
                                >
                                    <i className="size-3.5 block">
                                        {assets.svg.lock}
                                    </i>
                                    <span className="block pt-1">secret</span>
                                </a>

                                <p className="w-0 h-[3px] bg-secondary mb-1 group-hover:w-full group-[.active]:w-full duration-500"></p>
                            </li>
                            <li className="group">
                                <a
                                    href="#settings"
                                    className="uppercase items-center mb-px justify-center font-bold text-slate-200 fill-slate-200 flex gap-1.5 duration-500 group-hover:text-secondary group-hover:fill-secondary group-hover:[.active]-wide group-[.active]:text-secondary group-[.active]:fill-secondary"
                                >
                                    <i className="size-4 block">
                                        {assets.svg.setting}
                                    </i>
                                    <span className="block pt-1">settings</span>
                                </a>

                                <p className="w-0 h-[3px] bg-secondary mb-1 group-hover:w-full group-[.active]:w-full duration-500"></p>
                            </li>
                        </ul>
                    </nav>

                    <div className="w-full max-h-[50vh] overflow-x-hidden overflow-y-scroll pr-2 has-scrollbar">
                        {data &&
                            Array.isArray(data) &&
                            data.map((history) => (
                                <Content key={history.id} history={history} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
function Content({ history }) {
    const { id, content, status, pin, timestamp } = history || {};

    return (
        <div className="p-2.5 rounded-xl bg-slate-900 mt-2">
            <div className="w-full border-b border-solid border-slate-700 pb-1 mb-2 flex justify-between items-center">
                <p className="text-sm italic text-slate-500">
                    <span className="text-secondary/60 not-italic font-bold pr-3">
                        {id}
                    </span>
                    {moment(timestamp).format("LLLL")}
                </p>

                <ul className="flex gap-2">
                    <li
                        onClick={() => navigator.clipboard.writeText(content)}
                        className="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-slate-200 hover:bg-slate-100 hover:fill-slate-900 duration-500 cursor-pointer"
                    >
                        <i className="block size-4 leading-3 m-0 p-0">
                            {assets.svg.copy}
                        </i>
                    </li>

                    <li className="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-cyan-200 hover:bg-cyan-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i className="block size-4 leading-3 m-0 p-0">
                            {assets.svg.edit}
                        </i>
                    </li>

                    <li className="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-violet-200 hover:bg-violet-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i className="block size-4 leading-3 m-0 p-0">
                            {assets.svg.pin}
                        </i>
                    </li>

                    <li className="bg-slate-700 size-8 pb-0.5 flex items-center justify-center rounded fill-red-200 hover:bg-red-500 hover:fill-slate-100 duration-500 cursor-pointer">
                        <i className="block size-4 leading-3 m-0 p-0">
                            {assets.svg.delete}
                        </i>
                    </li>
                </ul>
            </div>

            <div className="text-md leading-[1.3] text-slate-300">
                {sliceText(content)}
            </div>
        </div>
    );
}
