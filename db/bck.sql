PGDMP                         {           mirkodb    15.2    15.2     
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398    mirkodb    DATABASE     z   CREATE DATABASE mirkodb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Polish_Poland.1252';
    DROP DATABASE mirkodb;
                postgres    false            �            1259    16400    mikro_orm_migrations    TABLE        CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name text,
    executed_at timestamp with time zone
);
 (   DROP TABLE public.mikro_orm_migrations;
       public         heap    postgres    false            �            1259    16399    mikro_orm_migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.mikro_orm_migrations_id_seq;
       public          postgres    false    215                       0    0    mikro_orm_migrations_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;
          public          postgres    false    214            �            1259    16431    post_id_seq    SEQUENCE     t   CREATE SEQUENCE public.post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.post_id_seq;
       public          postgres    false            �            1259    16409    post    TABLE     �   CREATE TABLE public.post (
    id integer DEFAULT nextval('public.post_id_seq'::regclass) NOT NULL,
    title text NOT NULL,
    updated_at timestamp(0) with time zone NOT NULL,
    created_at timestamp(0) with time zone NOT NULL
);
    DROP TABLE public.post;
       public         heap    postgres    false    217            �            1259    16464    user    TABLE     �   CREATE TABLE public."user" (
    id integer,
    username text,
    password text,
    updated_at timestamp with time zone,
    created_at timestamp with time zone
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    16463    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public          postgres    false    219                       0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public          postgres    false    218            o           2604    16403    mikro_orm_migrations id    DEFAULT     �   ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);
 F   ALTER TABLE public.mikro_orm_migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            q           2604    16480    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219                      0    16400    mikro_orm_migrations 
   TABLE DATA           E   COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
    public          postgres    false    215   �                 0    16409    post 
   TABLE DATA           A   COPY public.post (id, title, updated_at, created_at) FROM stdin;
    public          postgres    false    216                    0    16464    user 
   TABLE DATA           P   COPY public."user" (id, username, password, updated_at, created_at) FROM stdin;
    public          postgres    false    219   �                  0    0    mikro_orm_migrations_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 2, true);
          public          postgres    false    214                       0    0    post_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.post_id_seq', 11, true);
          public          postgres    false    217                       0    0    user_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.user_id_seq', 14, true);
          public          postgres    false    218            s           2606    16406 .   mikro_orm_migrations mikro_orm_migrations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.mikro_orm_migrations DROP CONSTRAINT mikro_orm_migrations_pkey;
       public            postgres    false    215               1   x�3���L/J,���32026064024106���2�*id������ a]         �   x���;� ��9��=��(�]�� ����/���F����/>, ���X��nω�8 ̞@"	�p�*��c$���l�()*�gKfIE�=[�UE�|&�S@��� wْ�|Pd϶��w�d�gV}&h=�@���J���a�e�yX������s��b�         
  x���˒�H��u��`G7f&dF��r����l E�T.O?�S�5]Ĵ�?2�<�q��p��/tX.9:������`̑o�������*��&�WG9j���f��@��9m�C����#N��JS� 鶏�le���/� �����W��dy�g ��D��|��8�r�)���Q0�2�"�-$�Z��ђ�]nS?�
FY/���E�]k�hWɟ`%���Y(�9�v!:AnX�mduj��j�[�2#���:S�\^���Qr��vՋ�MRU�_?x�"$��>�?�c����-�ʙ�wEaFB��t��į��w��c#㓘������X�wK��ES����O������w�pp�d�7��Q�aW�CG�ʤx�Fގ���޸(�����MW���a+��>�]!y�Űo��$�<	�#rl����2J�X��5R禷�عw�]ȭ��n�Cԙ�vV�bޭdU�˱������,��g௉�6^�M�tV���}l����r�InXiU(��:�h��I�},�x��|Z�
�oN3{��\����@�I�i�ʅ�;��Z�`]��L�µ�J��3#S����o�q5���W�Q��e��?����Pb4�a�?`_��'���I��uq��.�o���8Э�m���7�����$��i�.�D�D�,F�p����v>+ `1z����I��-W:��'A�7wwR��vv���7����Lx�Q��.��m<���u2�ħ��Y"�~��DA�.���H07h�4�җ����k��oSF�Yq�3�����|�19��6R"�"�ʋ�@q[��q`V���ѳ@�>�mwo��\�R�m�(�� B5K���D'�03#Zθ+����o���kh�ұ2?38��~�G���.��0N��Łc7�uV�pЋV���<od�7�-4v����!�&M4�Kf&�53�^F=_�G,$����(�?mt�X���ȅo�Ύe:�c�L��B5�7�k��W�cɗH8��7~��:��;�"��	?�KQ���f]n     