/**
 * Professional Product Card Skeleton Loader
 * Displays animated skeleton while products are loading
 */

import styles from "@/styles/SearchPopup.module.css";

export function ProductCardSkeleton() {
  return (
    <div className={`${styles.categoryCard} ${styles.skeleton}`}>
      <div className={`${styles.skeletonImage} ${styles.shimmer}`}></div>
      <div className={`${styles.skeletonText} ${styles.shimmer}`}></div>
      <div className={`${styles.skeletonText} ${styles.skeletonTextShort} ${styles.shimmer}`}></div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.categoryGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
