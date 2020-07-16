import NextHead from 'next/head';
import { string } from 'prop-types';

// const defaultDescription = '';
// const defaultKeywords = '';
// const defaultOGURL = '';
// const defaultOGImage = '';

const HtmlHead = (props) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="renderer" content="webkit"/>
    <meta name="description" content={props.description} />
    <meta name="keywords" content={props.keywords} />
    <meta name="author" content="Explorer Wu"/>
    <link rel="icon" type="image/png" sizes="16x16" href="/public/images/favicon-16x16.png"/>
    <link rel="icon" type="image/png" sizes="32x32" href="/public/images/favicon-32x32.png" />
    <link rel="shortcut icon" href="/public/images/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/public/images/apple-touch-icon.png" />
    <link rel="mask-icon" href="/public/images/favicon-mask.svg" color="#000000" />
    <meta property="og:url" content={props.url} />
    <meta property="og:title" content={'KOA+Next.js应用模版-'+props.title || 'KOA+Next.js应用模版'} />
    <meta property="og:description" content={props.description} />
    <meta name="twitter:site" content={props.url} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage} />
    <meta property="og:image" content={props.ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <title>{'KOA+Next.js应用模版-'+props.title}</title>
  </NextHead>
);

HtmlHead.propTypes = {
  title: string,
  description: string,
  keywords: string,
  url: string,
  ogImage: string
};

// 指定 props 的默认值：
HtmlHead.defaultProps = {
  title: "",
  description: "",
  keywords: "",
  url: "",
  ogImage: "",
};

export default HtmlHead;