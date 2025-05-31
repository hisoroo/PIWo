import { index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("/new", "routes/new.tsx"),
    route("/edit/:bookId", "routes/edit.tsx"),
];
