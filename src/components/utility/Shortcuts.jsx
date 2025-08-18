import { Card, CardContent } from '../common/Card'
import { Link } from 'react-router-dom'

export default function Shortcuts() {
    return (
        <Card className="p-4">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Shortcuts</div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">
                        <Link
                            to="/trips/create"
                            className="flex items-center gap-2">
                            Tạo chuyến đi
                        </Link>
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white rounded">
                        <Link
                            to="/locations/create"
                            className="flex items-center gap-2">
                            Thêm điểm đến cho chuyến đi
                        </Link>
                    </button>
                    <button className="px-3 py-2 bg-yellow-500 text-white rounded">
                        <Link
                            to="/calendar"
                            className="flex items-center gap-2">
                            Mở Lịch
                        </Link>
                    </button>
                </div>
            </CardContent>
        </Card>


    )
}
