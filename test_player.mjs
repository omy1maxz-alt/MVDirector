import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactPlayer from 'react-player';

const html = renderToString(React.createElement(ReactPlayer, { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' }));
console.log(html);
