import React from "react";


interface Props {
title: string;
highlight?: string;
desc?: string;
}


const SectionTitle: React.FC<Props> = ({ title, highlight, desc }) => {
return (
<div className="text-center py-8">
<h2 className="text-2xl sm:text-3xl font-bold">
{title} {highlight && <span className="text-indigo-600">{highlight}</span>}
</h2>
{desc && <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{desc}</p>}
</div>
);
};


export default SectionTitle;