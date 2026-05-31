import NotificationsPanel from '../components/NotificationsPanel'
import ActivityPanel from '../components/ActivityPanel'

function Alerts() {
  return (
    <section className="mb-8">

      <div className="
        relative
        overflow-hidden
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-8
        mb-6
        backdrop-blur-xl
      ">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,138,0,0.10),transparent_35%)]"></div>
        <div className="absolute top-0 right-0 h-[2px] w-40 bg-orange-400/60"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black">
            مركز التنبيهات
          </h1>

          <p className="text-gray-400 mt-4 leading-8 max-w-3xl">
            مراقبة التنبيهات التشغيلية الناتجة عن مؤشرات المرور، جودة الهواء،
            الطاقة، المياه، والسلامة العامة داخل نطاق منصة بصيرة.
          </p>
        </div>

      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        <div className="xl:col-span-2">
          <NotificationsPanel />
        </div>

        <ActivityPanel />

      </div>

    </section>
  )
}

export default Alerts