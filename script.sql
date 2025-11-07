create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(100) not null,
    description text         null,
    constraint name
        unique (name)
);

create table products
(
    id              int auto_increment
        primary key,
    name            varchar(100)   not null,
    description     text           null,
    quantity        int            null,
    price           decimal(10, 2) null,
    warranty_months int            null,
    distributor     varchar(100)   null,
    category_id     int            null,
    constraint fk_products_categories
        foreign key (category_id) references categories (id)
            on delete set null,
    check (`quantity` >= 0),
    check (`price` >= 0)
);

create table users
(
    id       int auto_increment
        primary key,
    name     varchar(100) not null,
    email    varchar(100) not null,
    address  text         null,
    password varchar(255) not null,
    constraint email
        unique (email)
);

create table orders
(
    id         int auto_increment
        primary key,
    user_id    int                                   null,
    status     varchar(50) default 'PENDING'         null,
    created_at timestamp   default CURRENT_TIMESTAMP null,
    constraint fk_orders_users
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create table order_items
(
    id         int auto_increment
        primary key,
    order_id   int            null,
    product_id int            null,
    quantity   int            null,
    unit_price decimal(10, 2) null,
    constraint fk_orderitems_orders
        foreign key (order_id) references orders (id)
            on update cascade on delete cascade,
    constraint fk_orderitems_products
        foreign key (product_id) references products (id)
            on update cascade,
    check (`quantity` > 0),
    check (`unit_price` >= 0)
);

create table reviews
(
    id         int auto_increment
        primary key,
    product_id int                                 not null,
    user_id    int                                 null,
    rating     int                                 null,
    comment    text                                null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint fk_reviews_products
        foreign key (product_id) references products (id)
            on delete cascade,
    constraint fk_reviews_users
        foreign key (user_id) references users (id)
            on delete set null,
    constraint chk_rating
        check ((`rating` >= 1) and (`rating` <= 5))
);

