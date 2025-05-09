import Link from "next/link";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import * as React from "react";

export type IMenu = {
  id: number;
  title: string;
  url: string;
  dropdown?: boolean;
  items?: IMenu[];
  submenu?: boolean; // Para indicar si un elemento del dropdown tiene un submenú
};

type MenuProps = {
  list: IMenu[];
};

const NavBar = ({ list }: MenuProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <MotionConfig transition={{ bounce: 0, type: "tween" }}>
      <nav className={"relative"}>
        <ul className={"flex items-center flex-wrap"}>
          {list?.map((item) => {
            return (
              <li key={item.id} className={"relative"}>
                <Link
                  className={`
                    relative flex items-center justify-center rounded px-4 py-2 transition-all
                    hover:bg-foreground/10 font-medium
                    ${hovered === item?.id ? "bg-foreground/10" : ""}
                  `}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  href={item?.url}
                >
                  {item?.title}
                </Link>
                {hovered === item?.id && !item?.dropdown && (
                  <motion.div
                    layout
                    layoutId={`cursor`}
                    className={"absolute h-0.5 w-full bg-mascolor-primary"}
                  />
                )}
                {item?.dropdown && hovered === item?.id && (
                  <div
                    className="absolute left-0 top-full"
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div
                      layout
                      transition={{ bounce: 0 }}
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      exit={{ y: 10 }}
                      style={{
                        borderRadius: "8px",
                      }}
                      className="mt-4 flex w-72 flex-col rounded bg-white shadow-lg"
                      layoutId={"cursor"}
                    >
                      {item?.items?.map((nav) => {
                        // Si el elemento tiene submenu, renderizamos un div con evento hover
                        if (nav.submenu && nav.items && nav.items.length > 0) {
                          return (
                            <div
                              key={`submenu-${nav?.id}`}
                              className="relative group"
                            >
                              <div
                                className={
                                  "w-full p-4 hover:bg-mascolor-primary hover:text-white text-mascolor-dark transition-colors flex justify-between items-center cursor-pointer"
                                }
                              >
                                {nav?.title}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="ml-1"
                                >
                                  <path d="M9 18l6-6-6-6"></path>
                                </svg>
                              </div>
                              {/* Submenú de segundo nivel */}
                              <div className="absolute left-full top-0 hidden group-hover:block">
                                <div className="ml-2 w-64 flex flex-col rounded bg-mascolor-primary shadow-lg">
                                  {nav.items.map((subItem) => (
                                    <motion.a
                                      key={`sublink-${subItem?.id}`}
                                      href={`${subItem?.url}`}
                                      className={
                                        "w-full p-4 hover:bg-mascolor-primary/80 text-white hover:text-white transition-colors"
                                      }
                                    >
                                      {subItem?.title}
                                    </motion.a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Si no tiene submenu, renderizamos un enlace normal
                        return (
                          <motion.a
                            key={`link-${nav?.id}`}
                            href={`${nav?.url}`}
                            className={
                              "w-full p-4 hover:bg-mascolor-primary hover:text-white text-mascolor-dark transition-colors"
                            }
                          >
                            {nav?.title}
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
};

export default NavBar;
