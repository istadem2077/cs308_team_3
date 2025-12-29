create table categories
(
    id   int auto_increment
        primary key,
    name varchar(100) not null,
    constraint name
        unique (name)
);

create table products
(
    id           int auto_increment
        primary key,
    name         varchar(100)   not null,
    description  text           null,
    image_url    varchar(255)   null,
    quantity     int            null,
    price        decimal(10, 2) null,
    category_id  int            null,
    total_orders int default 0  null,
    constraint fk_products_categories
        foreign key (category_id) references categories (id)
            on delete set null,
    check (`quantity` >= 0),
    check (`price` >= 0)
);

create table users
(
    id           int auto_increment
        primary key,
    name         varchar(100)            not null,
    email        varchar(100)            not null,
    password     varchar(255)            not null,
    phone_number int                     null,
    age          int                     null,
    gender       enum ('Male', 'Female') null,
    constraint email
        unique (email)
);

create table addresses
(
    id           int auto_increment
        primary key,
    user_id      int                  not null,
    address_line varchar(255)         not null,
    city         varchar(100)         not null,
    province     varchar(100)         not null,
    zip_code     varchar(20)          not null,
    is_default   tinyint(1) default 0 null,
    phone        int                  null,
    constraint fk_addresses_users
        foreign key (user_id) references users (id)
            on delete cascade
);

create table carts
(
    id      int auto_increment
        primary key,
    user_id int not null,
    constraint fk_carts_users
        foreign key (user_id) references users (id)
);

create table cart_items
(
    id         int auto_increment
        primary key,
    cart_id    int           not null,
    product_id int           not null,
    quantity   int default 1 not null,
    constraint fk_cartitems_cart
        foreign key (cart_id) references carts (id)
            on delete cascade,
    constraint fk_cartitems_product
        foreign key (product_id) references products (id)
);

create table orders
(
    id                  int auto_increment
        primary key,
    user_id             int                                   null,
    status              varchar(50) default 'PENDING'         null,
    created_at          timestamp   default CURRENT_TIMESTAMP null,
    shipping_address_id int                                   null,
    constraint fk_orders_addresses
        foreign key (shipping_address_id) references addresses (id)
            on delete set null,
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
    product_id int                                                                not null,
    user_id    int                                                                null,
    rating     int                                                                null,
    comment    text                                                               null,
    created_at timestamp                                default CURRENT_TIMESTAMP null,
    status     enum ('PENDING', 'APPROVED', 'REJECTED') default 'PENDING'         not null,
    constraint fk_reviews_products
        foreign key (product_id) references products (id)
            on delete cascade,
    constraint fk_reviews_users
        foreign key (user_id) references users (id)
            on delete set null,
    constraint chk_rating
        check ((`rating` >= 1) and (`rating` <= 5))
);

