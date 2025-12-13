import { blogHighlight, storeSummary } from "@/data/migration-content";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight, FaComments, FaUser } from "react-icons/fa";

export const PrefooterShowcase = () => {
  return (
    <>
      <div className="bg-yellow-300">
        <div className="max-w-screen-xl mx-auto px-3 mb-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] px-2 sm:px-4 py-2.5 w-full z-20 left-0">
            <div className="bg-slate-50">
              <div className="bg-black m-5 text-white">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 px-2 sm:px-4 py-2.5 w-full">
                  <div className="flex justify-start items-center">Latest From the Blog</div>
                  <div className="flex justify-end items-center">
                    <FaAngleLeft /> <FaAngleRight />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 px-2 sm:px-4 py-2.5 w-full">
                <div>
                  <img src={blogHighlight.image || "/images/blog/b1.jpg"} alt="Hometex Blog" />
                </div>
                <div className="relative justify-center items-center text-center">
                  <h3 className="text-xl font-extrabold p-3">
                    {blogHighlight.title || "DAILY OUTFITS"}
                  </h3>
                  <p className="text-sm p-3">
                    {blogHighlight.excerpt ||
                      "Hey guys, many of you ask us about the details on everyday outfits, so we thought we would collect them here with a few bonus pics. We hope you will like the idea! There are so many e..."}
                  </p>
                  <Link
                    href={(blogHighlight.href || "#") as any}
                    className="bg-yellow-500 mt-5 text-black px-5 py-2 rounded-sm justify-items-center inline-block"
                  >
                    Read More
                  </Link>
                  <div className="flex border-t-2 justify-between absolute inset-x-0 bottom-0">
                    <div className="flex items-center justify-start gap-2 mt-3">
                      <span>
                        <FaComments />
                      </span>
                      <span>COMMENTS</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <span>
                        <FaUser />
                      </span>
                      <span>{blogHighlight.author || "EDNA BARTON"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-black p-2 rounded text-white"> ABOUT OUR STORE</div>
              <div className="text-justify py-3">
                {storeSummary.summary || (
                  <>
                    Our store is more than just another average online retailer. We sell not only
                    top quality products, but give our customer a positive online shopping
                    experience. <br />
                    <br /> Forget about struggling to do everything at once: taking care of the
                    family, running your business, walking you dog, cleaning the house, doing the
                    shopping, etc. Purchase the goods you need every day or just like in a few
                    clicks or taps, depending on the device you use to access the internet. We work
                    to make your life more enjoyable.
                  </>
                )}
              </div>
              <div className="bg-black p-2 rounded text-white">GET CONNECTED</div>
              <div className="mt-5">Like, Share, or follow for exclusive info!</div>
              <div>
                <ul>
                  <li className="flex pt-5 justify-left space-x-4 text-gray-700">
                    {storeSummary.socials.map((social) => (
                      <Link
                        key={social.id}
                        href={social.href as any}
                        className="w-5 h-5 hover:text-info"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label}
                      </Link>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
